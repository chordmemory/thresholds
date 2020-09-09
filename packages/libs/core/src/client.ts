import { ThresholdClientTransport, ThresholdFunction } from "@threshold-types/core";

export const discoverThreshold =  async <T> (transport: ThresholdClientTransport<unknown>) => {
    const manifest = (await transport.getManifest());
    const thresholdFns = await Promise.all(manifest.thresholds.map(async (threshold) => {
      return {
        name: threshold.name,
        fn: await transport.getThreshold(threshold)
      };
    }));
    const result = thresholdFns.reduce<{ [fn: string]: ThresholdFunction }>((client, { name, fn }) => {
      client[name] = fn
      return client;
    }, {});
    return result as any as T
  }