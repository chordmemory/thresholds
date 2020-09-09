import { ServerTransport, ServerThresholdConfig, ThresholdClientConfig } from "@threshold-types/core";
import express from 'express';
import * as bodyParser from 'body-parser';

interface HttpClientThresholdOptions {
  protocol: string;
  domain: string;
  route: string;
  method: string;
  headers?: HeadersInit
}

export interface HttpServerOptions {
    route: string;
    method: string;
    port?: number;
    paramMapper?: (params: any, body?: unknown[]) => any[];
}

const defaultParamMapper = (params: { [param: string]: unknown; rest?: unknown[] }) => {
    const namedParams = {
        ...params,
        rest: undefined
    };
    return [ namedParams, ...(params.rest || []) ];
};

export class HttpTransportServer implements ServerTransport<HttpServerOptions> {
    constructor(private port: number){
        this.server = new Promise(resolve => {
            const app = express();
            app.use(bodyParser.json());
            app.listen(port, () => resolve(app))
        });
    };
    private server: Promise<express.Express>

    public async startThreshold(config: ServerThresholdConfig<HttpServerOptions>): Promise<ThresholdClientConfig<HttpClientThresholdOptions>> {
        const app = await this.server;
        const { route, method, paramMapper } = config.options;
        const { name } = config;

        const methodHandlers = {
            get: () => {
                app.get(route, async (req: express.Request, res: express.Response) => {
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
                app.post(route, async (req: express.Request, res: express.Response) => {
                    const args = (paramMapper || ((params, body) => body as unknown[]))(req.params, (req as any).body);
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
        methodHandlers[config.options.method.toLowerCase() as 'get' |'post']();

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