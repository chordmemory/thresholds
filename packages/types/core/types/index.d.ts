export interface PropertyDefinition<T> {
  name: string;
  transport: string;
  options: T;
}

export interface ConsumerManifest<T> {
  properties: PropertyDefinition<T>[];
}

export interface Consumer<tManifestOptions, tFuncOptions> {
  getManifest(
    config: tManifestOptions
  ): ConsumerManifest<tFuncOptions> | Promise<ConsumerManifest<tFuncOptions>>;
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

export interface Exposer<T, V = undefined> {
  exposeProperty(threshold: ExposedProperty<T>): Promise<PropertyDefinition<V>>;
}

export interface ThresholdServiceServerConfig {
  manifest: Omit<ExposedProperty<unknown>, 'implementation'>;
  thresholds: ExposedProperty<unknown>[];
}
