import { service, func } from "@riker-libs/decorators";
import { http } from "@riker-transports/http";
@service({
  name: 'Foo',
  transport: http
})
export class Foo { 
  constructor(private password: string) {}

  @func()
  getPassword(){
    return this.password;
  }
}