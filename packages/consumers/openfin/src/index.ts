import {
  Consumer,
  ConsumerManifest,
  PropertyDefinition
} from '@threshold-types/core';
import { v5 as uuid } from 'uuid';
import OpenFin, { fin } from '@openfin/core';

const uuidNamespace = '236ad03b-7c2c-429c-8570-a4d9bee3f0c8';

export interface OpenfinPropertyDefinition {
  iabId: string;
}

export interface OpenfinSchemaOptions {
  identity?: {
    uuid?: string;
    name?: string;
  };
  iabId: string;
}

export class OpenFinConsumer
  implements Consumer<OpenfinSchemaOptions, OpenfinPropertyDefinition>
{
  constructor(private iab = fin.InterApplicationBus) {}

  private once = async (
    identity: Omit<OpenFin.Identity, 'name'> & { name?: string },
    topic: string,
    listener: any
  ) => {
    const handler = (payload: any) => {
      this.iab.unsubscribe(identity, topic, handler);
      listener(payload);
    };
    await this.iab.subscribe(identity, topic, handler);
  };

  public async getManifest(config: OpenfinSchemaOptions) {
    const targetIdentity = {
      uuid: config.identity?.uuid || '*',
      name: config.identity?.name
    };
    return new Promise<ConsumerManifest<OpenfinPropertyDefinition>>(
      async (resolve, reject) => {
        try {
          const correlationId = uuid(config.iabId, uuidNamespace);
          await this.once(
            targetIdentity,
            correlationId,
            (payload: { error?: Error; result: any }) => {
              resolve(payload.result);
            }
          );
          await this.iab.send(targetIdentity, config.iabId, {
            correlationId: uuid(config.iabId, uuidNamespace)
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public async createFunction(
    config: PropertyDefinition<OpenfinPropertyDefinition>
  ) {
    return async (...args: unknown[]) => {
      // TODO - how to determine this? Send in property, or schema?
      // const targetIdentity = {
      //   uuid: config.identity?.uuid || '*',
      //   name: config.identity?.name
      // };
      return new Promise<ConsumerManifest<OpenfinPropertyDefinition>>(
        async (resolve, reject) => {
          try {
            const correlationId = uuid(config.options.iabId, uuidNamespace);
            await this.once(
              { uuid: '*' },
              correlationId,
              (payload: { error?: Error; result: any }) => {
                const { error, result } = payload;
                if (error) {
                  reject(error);
                }
                resolve(result);
              }
            );
            await this.iab.send({ uuid: '*' }, config.options.iabId, {
              correlationId,
              args
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    };
  }
}
