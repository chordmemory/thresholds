import { ExposedProperty } from '@threshold-types/core';

export type DecoratorProperty<T> = Omit<
  ExposedProperty<T>,
  'transport' | 'implementation'
> & {
  // Transport is optional in decorator, as it defaults to whatever exposer you use to expose the schema of a threshold.
  transport?: string;
  propertykey: string | symbol;
};

export const PROPERTIES_SYMBOL = Symbol();

export const expose = function <T>(
  transport?: string,
  name?: string,
  options?: T
): PropertyDecorator {
  return function (target: any, key: string | symbol): void {
    const exposedProperties = (target[PROPERTIES_SYMBOL] =
      target[PROPERTIES_SYMBOL] || []);

    const threshold: DecoratorProperty<T | undefined> = {
      name: name || key.toString(),
      propertykey: key,
      options,
      transport
    };
    target[PROPERTIES_SYMBOL] = [...exposedProperties, threshold];
  };
};
