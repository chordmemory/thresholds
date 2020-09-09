import * as React from 'react';
import { render } from 'react-dom';
import { HttpThreshold } from '@thresholds-consumers/http';
import { discoverThreshold } from '@thresholds/core';
import { ChatDemo } from './chat-demo';
import { ChatApi } from './chat-api';

(async () => {
    const chatApi = await discoverThreshold<ChatApi>(new HttpThreshold({
        manifestUrl: 'http://localhost:9080/manifest'
    }));

    render((
        <ChatDemo
            chatApi={chatApi}
        />
    ),
    document.getElementById('chat-list'))
})()