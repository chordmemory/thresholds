import { Consumer } from "@threshold-types/core";

const consumerMap: {
  [name: string]: Consumer<unknown, unknown>
} = {};

export const useConsumer = (consumerName: string, consumer: Consumer<unknown, unknown>) => {
  consumerMap[consumerName] = consumer;
}

export const consume =  async <tResult, tManifestOptions> (consumerId: string, options: tManifestOptions) => {
  const consumer = consumerMap[consumerId];
  if (!consumer) {
    throw new Error(`No consumer configured with name ${consumerId}`);
  }
  const manifest = await consumer.getManifest(options);
  const thresholdFns = await Promise.all(manifest.properties.map(async (func) => {
    return {
      name: func.name,
      fn: await consumer.createFunction(func)
    };
  }));
  const result = thresholdFns.reduce<{ [fn: string]: Function }>((client, { name, fn }) => {
    client[name] = fn
    return client;
  }, {});
  return result as any as tResult
}