import { ThresholdClientConfig } from "./client";

export interface ServerThresholdConfig<T>{
    transport: string;
    name: string;
    options:T;
    implementation: Function;
  }
  
  export interface ServerTransport<T> {
    startThreshold(threshold: ServerThresholdConfig<T>): Promise<ThresholdClientConfig<unknown>>;
  }
  
  export interface ThresholdServiceServerConfig {
    manifest: Omit<ServerThresholdConfig<unknown>, 'implementation'>;
    thresholds: ServerThresholdConfig<unknown>[];
  }