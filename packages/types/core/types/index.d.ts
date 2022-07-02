export interface PropertyDefinition<T> {
  name: string;
  transport: string;
  options: T;
}

export interface PropertySchema<T> {
  name: string;
  transport: string;
  options: T;
}

export interface ThresholdConsumerSchema<T> {
  properties: PropertyDefinition<T>[];
}

export interface Consumer<tSchemaOptions, tFuncOptions> {
  getSchema(
    config: tSchemaOptions
  ):
    | ThresholdConsumerSchema<tFuncOptions>
    | Promise<ThresholdConsumerSchema<tFuncOptions>>;
  createFunction(
    config: PropertyDefinition<tFuncOptions>
  ): Function | Promise<Function>;
}

export interface ExposedProperty<T> {
  transport: string;
  name: string;
  options: T;
  implementation: Function;
}

export interface Exposer<
  PropertyExposeOptions = unknown,
  PropertySchemaOptions = unknown
> {
  exposeProperty(
    property: ExposedProperty<PropertyExposeOptions>
  ): Promise<PropertySchema<PropertySchemaOptions>>;
}
