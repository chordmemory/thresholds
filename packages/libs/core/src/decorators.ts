import { ExposedProperty } from "@threshold-types/core";
import 'reflect-metadata';

export const threshold = <T> (transport: string, options: T): ClassDecorator => target =>  {
  Reflect.defineMetadata('manifest', {
    transport,
    options
  }, target.prototype)
};

export const expose = <T> (transport: string, options: T): MethodDecorator => (target, name, descriptor) => {
  if (typeof descriptor.value === 'function') {
    const thresholdMetadata = Reflect.getMetadata('exposed-properties', target) || [];
    const threshold: ExposedProperty<T> = {
      name: name.toString(),
      implementation: descriptor.value,
      options,
      transport
    };
    Reflect.defineMetadata('exposed-properties', [ ...thresholdMetadata, threshold ], target)    
  }
  return descriptor;
}