import * as React from 'react';
import { render } from 'react-dom';
import { HttpConsumer, HttpManifestConfig } from '@thresholds/http-consumer';
import * as thresholds from '@thresholds/core';
import { ChatDemo } from './chat-demo';
import { ChatApi } from './chat-api';
import { consume } from '@thresholds/core';

thresholds.useConsumer('http', new HttpConsumer());

(async () => {
    const chatApi = await consume<ChatApi, HttpManifestConfig>('http', { 
        url: 'http://localhost:9080/manifest'
    });

    render((
        <ChatDemo
            chatApi={chatApi}
        />
    ),
    document.getElementById('chat-list'))
})()