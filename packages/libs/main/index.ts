import { ServiceOptions, Features } from "@riker-types/index";

export const start = (options: ServiceOptions, features: Features) => {
  console.log(`Creating service ${options.name}`);
  Promise.all([
    ...Object.values(features.functions || {}).map(async func => {
      console.log(`Creating function ${func.name}`);
      if (func.transport) {
        await func.transport.createFunc(func);
      } else {
        await options.transport.createFunc(func);
      }
      console.log(`Successfully created function ${func.name}`);
    }),
    ...Object.values(features.streams || {}).map(async stream => {
      console.log(`Creating stream ${stream.name}`);
      if (stream.transport) {
        await stream.transport.createStream(stream);
      } else {
        await options.transport.createStream(stream);
      }
      console.log(`Successfully created stream ${stream.name}`);
    })
  ]);
}

export * from '../decorators';