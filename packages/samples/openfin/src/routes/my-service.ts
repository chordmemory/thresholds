import { expose } from '@thresholds/core';

const topLevelVar = 'toplevel';

export class MyService {
  constructor(private value: any) {}

  @expose()
  public log = (...args: any[]) => {
    console.log('Remote logs!', ...args);
  };

  @expose()
  public asyncThing = async () => {
    await new Promise((resolve) => setTimeout(() => resolve('delayed!'), 1000));
  };

  @expose()
  public getValue = () => this.value;

  @expose()
  public getTopLevelVar = () => topLevelVar;
}
