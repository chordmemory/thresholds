import {
  ThresholdConsumerSchema,
  Exposer,
  ExposedProperty,
  PropertyDefinition,
  PropertySchema
} from '@threshold-types/core';
import 'reflect-metadata';
import { DecoratorProperty, PROPERTIES_SYMBOL } from './decorators';

const exposerMap: {
  [key: string]: Exposer<unknown, unknown>;
} = {};

const exposeProperty = async (
  exposableProperty: ExposedProperty<unknown>
): Promise<PropertySchema<unknown>> => {
  const exposer = exposerMap[exposableProperty.transport];
  const property = await exposer.exposeProperty(exposableProperty);
  console.info(
    `threshold:exposer:${exposableProperty.transport}: Exposed property`,
    property
  );
  return property;
};

export const useExposer = (
  exposerName: string,
  exposer: Exposer<unknown, unknown>
) => {
  exposerMap[exposerName] = exposer;
};

export const exposeInstance = async (
  instance: Record<string | symbol, any>,
  schemaExposerTransport: string,
  schemaExposerName?: string,
  schemaExposerOptions?: unknown
) => {
  const exposedProperties: DecoratorProperty<unknown>[] =
    instance[PROPERTIES_SYMBOL];

  if (!exposedProperties?.length) {
    throw new Error('Instance does not have any exposed properties');
  }
  const propertyDefinitions = await Promise.all(
    exposedProperties.map((exposedProperty) =>
      exposeProperty({
        ...exposedProperty,
        implementation: instance[exposedProperty.propertykey].bind(instance),
        transport: exposedProperty.transport || schemaExposerTransport
      })
    )
  );
  const thresholdSchema: ThresholdConsumerSchema<unknown> = {
    properties: propertyDefinitions
  };
  await exposeProperty({
    name: schemaExposerName || 'schema',
    options: schemaExposerOptions,
    transport: schemaExposerTransport,
    implementation: () => thresholdSchema
  });
  console.info(
    `thresholds:expose:${schemaExposerTransport}: Exposed schema`,
    thresholdSchema
  );
};
