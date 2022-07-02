import { Exposer, ExposedProperty } from '@threshold-types/core';
import { v5 as uuid } from 'uuid';
import OpenFin, { fin } from '@openfin/core';

const uuidNamespace = '236ad03b-7c2c-429c-8570-a4d9bee3f0c8';

export class OpenFinExposer
  implements Exposer<{ iabId?: string }, { iabId: string }>
{
  constructor(private interAppBus = fin.InterApplicationBus) {}

  public exposeProperty = async (
    property: ExposedProperty<{ iabId?: string } | undefined>
  ) => {
    const topic = property.options?.iabId || uuid(property.name, uuidNamespace);
    await this.interAppBus.subscribe(
      { uuid: '*' },
      topic,
      async (
        payload: { args?: unknown[]; correlationId: string },
        sender: { uuid: string; name: string }
      ) => {
        try {
          console.debug('threshold:exposer:openfin invoked', {
            payload,
            sender
          });
          const result = await property.implementation(...(payload.args || []));
          this.interAppBus.send(sender, payload.correlationId, { result });
        } catch (error: any) {
          this.interAppBus.send(sender, payload.correlationId, {
            error: error.stack.toString()
          });
        }
      }
    );
    // I think this can just return the options, caller should know transport + name
    const definition = {
      name: property.name,
      transport: property.transport,
      options: { iabId: topic }
    };
    return definition;
  };
}
