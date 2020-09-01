import { ServiceClientManifest, ServerTransport, ServerThresholdConfig, ThresholdServiceServerConfig } from "@threshold-types/index";
import 'reflect-metadata';

type TransportMap = {
    [key: string]: ServerTransport<unknown>
}

export const startThreshold = async (config: ServerThresholdConfig<unknown>, map: TransportMap) => {
    const transportImplementation = map[config.transport];
    return await transportImplementation.startThreshold(config);
}

export const startService = async (service: Object, map: TransportMap) => {
    const manifest = Reflect.getMetadata('manifest', service);
    const thresholds = Reflect.getMetadata('thresholds', service) || [];
    const clientConfigs = await Promise.all(thresholds.map(threshold => startThreshold({
        ...threshold,
        implementation: threshold.implementation.bind(service) // todo need smarter way of ensuring scope of implementation bound to containing class
     }, map)));
    const clientManifest: ServiceClientManifest = {
        thresholds: clientConfigs as any
    }
    console.log(manifest, thresholds);
    await startThreshold({
        name: 'manifest',
        options: manifest.options,
        transport: manifest.transport,
        implementation: () => clientManifest
    }, map);
}  