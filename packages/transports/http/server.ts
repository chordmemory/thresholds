import { ServerTransport, ServerThresholdConfig, ThresholdClientConfig } from "@threshold-types/index";
import { HttpClientThresholdOptions } from './client';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

export interface HttpServerOptions {
    route: string;
    method: string;
    port?: number;
    paramMapper?: (params: { [paramName: string]: any }, body?) => any[];
}

const defaultParamMapper = (params) => {
    const namedParams = {
        ...params,
        rest: undefined
    };
    return [ namedParams, ...(params.rest || []) ];
};

export default class HttpTransportServer implements ServerTransport<HttpServerOptions> {
    constructor(private port: number){
        this.server = new Promise(resolve => {
            const app = express();
            app.use(cors());
            app.use(bodyParser.json());
            app.listen(port, () => resolve(app))
        });
    };
    private server: Promise<express.Server>

    public async startThreshold(config: ServerThresholdConfig<HttpServerOptions>): Promise<ThresholdClientConfig<HttpClientThresholdOptions>> {
        const app = await this.server;
        const { route, method, paramMapper } = config.options;
        const { name } = config;

        const methodHandlers = {
            get: () => {
                app.get(route, async (req, res) => {
                    const params = (paramMapper || defaultParamMapper)(req.params);
                    console.log('GET', config.name, params);
                    try {
                        const result = await config.implementation(...params);
                        res.json(result);
                    } catch (error) {
                        console.log(`Unexpected error executing function ${config.name}`, error);
                        res.status(500).send('Unexpected error executing function. See server logs for info');
                    }
                });
            },
            post: () => {
                app.post(route, async (req: express.Request, res) => {
                    const args =(paramMapper || ((params, body) => body))(req.params, (req as any).body);
                    console.log('POST', config.name, args);
                    try {
                        const result = await config.implementation(...args);
                        res.json(result);
                    } catch (error) {
                        console.log(`Unexpected error executing function ${config.name}`, error);
                        res.status(500).send('Unexpected error executing function. See server logs for info');
                    }
                });
            }
        }
        
        console.log('Create threshold', config);
        methodHandlers[config.options.method.toLowerCase()]();

        return {
            name: config.name,
            transport: config.transport,
            options: {
                protocol: 'http',
                method: config.options.method,
                domain: `localhost:${this.port}`,
                route
            }
        }
    }
}