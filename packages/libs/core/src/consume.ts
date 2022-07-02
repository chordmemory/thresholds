import { Consumer } from '@threshold-types/core';

const consumerMap: {
  [name: string]: Consumer<unknown, unknown>;
} = {};

export const useConsumer = (
  consumerName: string,
  consumer: Consumer<unknown, unknown>
) => {
  consumerMap[consumerName] = consumer;
};

export const consume = async <tResult, tSchemaOptions>(
  consumerId: string,
  options: tSchemaOptions
) => {
  const consumer = consumerMap[consumerId];
  if (!consumer) {
    throw new Error(`No consumer configured with name ${consumerId}`);
  }
  const thresholdSchema = await consumer.getSchema(options);
  console.info(`thresolds:consume:schema:${consumerId}:`, thresholdSchema);
  const thresholdFns = await Promise.all(
    thresholdSchema.properties.map(async (func) => {
      return {
        name: func.name,
        fn: await consumer.createFunction(func)
      };
    })
  );
  const result = thresholdFns.reduce<{ [fn: string]: Function }>(
    (client, { name, fn }) => {
      client[name] = fn;
      return client;
    },
    {}
  );
  return result as any as tResult;
};
