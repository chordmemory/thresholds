import { Consumer, PropertyDefinition } from '@threshold-types/core';

export interface HttpPropertyConfig {
  url: string;
  method: string;
  headers?: HeadersInit;
}

export interface HttpManifestConfig {
  url: string;
}

const tokenizeRoute = (uri: string, args: unknown[]) => {
  const url = new URL(uri);
  const tokens = url.pathname.match(/:(\d|\w*)/gm);
  (tokens || []).forEach((token, index) => {
    url.pathname = url.pathname.replace(token, String(args[index]));
    args.splice(index, 1);
  });
  return url.toString();
};

export class HttpConsumer
  implements Consumer<HttpManifestConfig, HttpPropertyConfig> {
  public async getManifest(config: HttpManifestConfig) {
    const response = await fetch(config.url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  }

  public async createFunction(config: PropertyDefinition<HttpPropertyConfig>) {
    return async (...args: unknown[]) => {
      const { url, method, headers } = config.options;
      if (method.toLowerCase() === 'get') {
        const response = await fetch(
          `${tokenizeRoute(url, args)}?rest=${JSON.stringify(args)}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(headers || {})
            }
          }
        );
        return await response.json();
      } else {
        const response = await fetch(`${tokenizeRoute(url, args)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(headers || {})
          },
          body: JSON.stringify(args)
        });
        return await response.json();
      }
    };
  }
}
