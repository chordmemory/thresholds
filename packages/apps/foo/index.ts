import { service, func } from '@riker-libs/decorators';

@service({
  name: 'Foo',
  transport: { /* todo */ } as any
})
export class Foo {
  constructor() {}

  @func()
  public foo() {
    return 'foo'
  }
}

(window as any).Foo = Foo;