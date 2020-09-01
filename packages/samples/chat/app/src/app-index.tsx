import * as React from 'react';
import { render } from 'react-dom';
import { HttpThreshold } from '@threshold-transports/http/client';
import { discoverThreshold } from '@threshold-libs/main';
import { ChatDemo } from './chat-demo';
import { ChatApi } from './chat-api';

(async () => {
    const chatApi = await discoverThreshold<ChatApi>(new HttpThreshold({
        manifestUrl: 'http://localhost:9080/manifest'
    }));

    render((
        <ChatDemo
            {...chatApi}
        />
    ),
    document.getElementById('chat-list'))
})()