
export interface ThresholdClientConfig<T> {
    name: string;
    transport: string;
    options?: T;
  }
  
  export interface ServiceClientManifest {
    thresholds: ThresholdClientConfig<unknown>[]
  }
  
  type ThresholdFunction = (...args: any) => Promise<any> | any;
  
  export interface ThresholdClientTransport<T> {
    getManifest(): ServiceClientManifest | Promise<ServiceClientManifest>;
    getThreshold(config: ThresholdClientConfig<T>): ThresholdFunction | Promise<ThresholdFunction>;
  }
  