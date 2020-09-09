
import { ThresholdClientTransport, ThresholdClientConfig } from '@threshold-types/core';

export interface HttpClientThresholdOptions {
    protocol: string;
    domain: string;
    route: string;
    method: string;
    headers?: HeadersInit
}

const tokenizeRoute = (route: string, args: any[]) => {
    const tokens = route.match(/:(\d|\w*)/gm);
    (tokens || []).forEach((token, index) => {
        route = route.replace(token, args[index]);
        args.splice(index, 1);
    });
    return route;
};

export class HttpThreshold implements ThresholdClientTransport<HttpClientThresholdOptions>{
    constructor(private options: {
        manifestUrl: string
    }){}

    public async getManifest() {
        const response = await fetch(
            this.options.manifestUrl,
            {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return await response.json();
    }


    public async getThreshold(thresholdConfig: ThresholdClientConfig<HttpClientThresholdOptions>) {
        return async (...args: any[]) => {
            const { domain, protocol, route, method, headers } = thresholdConfig.options;
            if (method.toLowerCase() === 'get') {
                const response = await fetch(
                    `${protocol}://${domain}${tokenizeRoute(route, args)}?rest=${JSON.stringify(args)}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            ...headers || {}
                        }
                    }
                );
                return await response.json();
            } else {
                const response = await fetch(
                    `${protocol}://${domain}${tokenizeRoute(route, args)}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...headers || {}
                        },
                        body: JSON.stringify(args)
                    }
                ) 
                return await response.json();
            }
        }
    }
}