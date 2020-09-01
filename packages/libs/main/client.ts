import { ThresholdClientTransport } from "@threshold-types/index";

export const discoverThreshold =  async <T> (transport: ThresholdClientTransport<unknown>) => {
    const manifest = (await transport.getManifest());
    const thresholdFns = await Promise.all(manifest.thresholds.map(async (threshold) => {
      return {
        name: threshold.name,
        fn: await transport.getThreshold(threshold)
      };
    }));
    const result = thresholdFns.reduce((client, { name, fn }) => {
      client[name] = fn
      return client;
    }, {}) as T;
    return result
  }