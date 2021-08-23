import {
  ConsumerManifest,
  Exposer,
  ExposedProperty,
  PropertyDefinition
} from '@threshold-types/core';
import 'reflect-metadata';

const exposerMap: {
  [key: string]: Exposer<unknown, unknown>;
} = {};

const exposeProperty = async (
  exposableProperty: ExposedProperty<unknown>
): Promise<PropertyDefinition<unknown>> => {
  const exposer = exposerMap[exposableProperty.transport];
  return await exposer.exposeProperty(exposableProperty);
};

export const useExposer = (
  exposerName: string,
  exposer: Exposer<unknown, unknown>
) => {
  exposerMap[exposerName] = exposer;
};

export const exposeInstance = async (instance: Record<string, any>) => {
  const manifest = Reflect.getMetadata('manifest', instance);
  if (!manifest) {
    throw new Error('Manifest not defined for instance');
  }
  const exposedProperties: ExposedProperty<unknown>[] =
    Reflect.getMetadata('exposed-properties', instance) || [];
  if (!exposedProperties.length) {
    throw new Error('Instance does not have any exposed properties');
  }
  const propertyDefinitions = await Promise.all(
    exposedProperties.map((exposedProperty) =>
      exposeProperty({
        ...exposedProperty,
        implementation: exposedProperty.implementation.bind(instance)
      })
    )
  );
  const consumerManifest: ConsumerManifest<unknown> = {
    properties: propertyDefinitions
  };
  await exposeProperty({
    name: 'manifest',
    options: manifest.options,
    transport: manifest.transport,
    implementation: () => consumerManifest
  });
};
