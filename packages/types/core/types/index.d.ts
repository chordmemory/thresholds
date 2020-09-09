
export interface ThresholdClientConfig<T> {
  name: string;
  transport: string;
  options: T;
}

export interface ServiceClientManifest {
  thresholds: ThresholdClientConfig<unknown>[]
}

type ThresholdFunction = (...args: any) => Promise<any> | any;

export interface ThresholdClientTransport<T> {
  getManifest(): ServiceClientManifest | Promise<ServiceClientManifest>;
  getThreshold(config: ThresholdClientConfig<T>): ThresholdFunction | Promise<ThresholdFunction>;
}

export interface ServerThresholdConfig<T> {
  transport: string;
  name: string;
  options: T;
  implementation: Function;
}

export interface ServerTransport<T> {
  startThreshold(threshold: ServerThresholdConfig<T>): Promise<ThresholdClientConfig<unknown>>;
}

export interface ThresholdServiceServerConfig {
  manifest: Omit<ServerThresholdConfig<unknown>, 'implementation'>;
  thresholds: ServerThresholdConfig<unknown>[];
}
