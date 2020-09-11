import { Exposer, ExposedProperty, PropertyDefinition } from "@threshold-types/core";
import express from 'express';

export interface HttpConsumeConfig {
    url: string;
    method: string;
    headers?: HeadersInit
}

export interface HttpExposeOptions {
    route: string;
    method: string;
    paramMapper?: (params: any, body?: unknown[]) => any[];
}

const defaultParamMapper = (params: { [param: string]: unknown; rest?: unknown[] }) => {
    const namedParams = {
        ...params,
        rest: undefined
    };
    return [ namedParams, ...(params.rest || []) ];
};


export class HttpExposer implements Exposer<HttpExposeOptions> {
    constructor(private port: number, server?: express.Application){
        this.server = new Promise(resolve => {
            const app = server || express();
            app.use(express.json());
            app.listen(port, () => resolve(app))
        });
    };
    private server: Promise<express.Application>

    public async exposeProperty(config: ExposedProperty<HttpExposeOptions>): Promise<PropertyDefinition<HttpConsumeConfig>> {
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
        console.log(`http://localhost:${this.port}${route}`)
        return {
            name: config.name,
            transport: config.transport,
            options: {
                url: `http://localhost:${this.port}${route}`,
                method: config.options.method
            }
        }
    }
}