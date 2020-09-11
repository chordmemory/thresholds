import { ChatServer } from "./ChatServer"
import * as thresholds from "@thresholds/core";
import { HttpExposer } from "@thresholds/http-exposer";
import { ChatDb } from "./mock-dal";
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors())
thresholds.useExposer('http', new HttpExposer(9080, app as any));

(async () => {
    try {
        await thresholds.exposeInstance(new ChatServer(new ChatDb()));
    } catch(error) {
        console.error('Failed to expose instance', error);
    }
})();