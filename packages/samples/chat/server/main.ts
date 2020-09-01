import { ChatServer } from "./ChatServer"
import { startService } from "@threshold-libs/main";
import HttpTransportServer from "@threshold-transports/http/server";
import { ChatDb } from "./mock-dal";

startService(new ChatServer(new ChatDb()) as any, {
    http: new HttpTransportServer(9080)
});