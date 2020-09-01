import { ServerThresholdConfig } from "@threshold-types/index";
import 'reflect-metadata';

export const thresholdManifest = <T> (config: Omit<ServerThresholdConfig<T>, 'implementation'| 'name' | 'mapping'>) => target =>  {
  Reflect.defineMetadata('manifest', config, target.prototype)
};

export const thresholdFn = <T> (config: Omit<ServerThresholdConfig<T>, 'implementation' | 'name'>) => (target, name, descriptor) => {
  if (typeof descriptor.value === 'function') {
    const thresholdMetadata = Reflect.getMetadata('thresholds', target) || [];
    const threshold: ServerThresholdConfig<T> = {
      name,
      implementation: descriptor.value,
      options: config.options,
      transport: config.transport
    };
    Reflect.defineMetadata('thresholds', [ ...thresholdMetadata, threshold ], target)    
  }
  return descriptor;
}