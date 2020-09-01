
export * from './client';
export * from './server';

// export interface ServiceOptions {
//   name: string;
//   transport: ServerTransport
// }

// export interface ServerTransport {
//   createFunc: (func: Func) => Promise<void>;
//   createStream: (stream: Stream) => Promise<void>;
// }

// export interface Features {
//   functions?: {
//     [name: string]: Func
//   },
//   streams?: {
//     [name: string]: Stream
//   }
// };

// type FeatureTypes = 'func' | 'stream' | 'event';

// interface _Feature<tType extends FeatureTypes, tImplementation extends Function> {
//   type: tType;
//   name: string;
//   custom?: Object;
//   transport?: ServerTransport;
//   implementation: tImplementation
// }


// export type Func = _Feature<'func', (...args: any[]) => any>;
// export type Stream = _Feature<'stream', (stream: {
//   handler: StreamHandler,
//   args: any[]
// }) => void>

// export type Feature = Func | Stream;

// interface StreamHandler {
//   next(...args: any[]);
//   complete(...args: any[]);
//   error(error: Error);
// }
