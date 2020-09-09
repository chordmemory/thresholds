import { ChatServer } from "./ChatServer"
import { startService } from "@thresholds/core";
import { HttpTransportServer } from "@thresholds-transports/http";
import { ChatDb } from "./mock-dal";

startService(new ChatServer(new ChatDb()) as any, {
    http: new HttpTransportServer(9080)
});