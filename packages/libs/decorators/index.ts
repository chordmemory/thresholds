// import { ServiceOptions, Features, Func, Stream } from "@threshold-types/index";

// const serviceOptions = Symbol()
// const features = Symbol();



// export interface ServiceManifest {
//   options: ServiceOptions;
//   features?: Features
// };

// export const service = (options: ServiceOptions): ClassDecorator => ((
//   constructor
// ) => {
//   constructor.prototype[serviceOptions] = options;
// }) as any as ClassDecorator

// type MethodDecorator <T> = (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;

// export const func = (options?: {
//   name?: string;
// }): MethodDecorator<(...args: any) => any> => (target, key: string, descriptor) => {
//   if (!target.constructor.prototype[features]) {
//     target.constructor.prototype[features] = []
//   }
//   const funcDefinition: Func = {
//     name: options?.name || key,
//     implementation: descriptor.value,
//     type: 'func'
//   };
//   target.constructor.prototype[features].push(funcDefinition)
// }

// export const stream = (options?: { 
//   name?: string
// }): MethodDecorator<(...args: any) => any> => (target, key: string, descriptor) => {
//   const proto = target.constructor.prototype as { [features]?: Features };
//   if (!proto[features]) {
//     proto[features] = {}
//   }
//   if (!proto[features].streams) {
//     proto[features].streams = {};
//   }
//   const streamFeature: Stream = {
//     name: options?.name || key,
//     implementation: descriptor.value,
//     type: 'stream'
//   };
//   proto[features].streams[streamFeature.name] = streamFeature;
// }
