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
    return await new Promise((resolve) =>
      setTimeout(() => resolve('delayed!'), 1000)
    );
  };

  @expose()
  public getValue = () => this.value;

  @expose()
  public getTopLevelVar = () => topLevelVar;

  @expose()
  public thrower = () => {
    throw new Error('Ruh roh');
  };

  @expose()
  public asyncThrower = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    throw new Error('Ruh roh');
  };

  @expose()
  public rejectedPromise = () => Promise.reject(new Error('ruh roh'));
}
