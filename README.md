# Thresholds

A platform & protocol independent library for making remote procedure calls behave like normal code, based on decorators.

## What?

A threshold is some class or object that has been exposed via an arbitrary protocol.

A client can 'consume' a threshold, and automatically generate a client using the consumer API. No need to generate code, or manually implement a client. It just works.

## Show Me

Imagine a very simple http service that allows consumers to post and read notes.

Normally, you would either manually write or generate explicit code to do so.

However, to speed things up a bit, we can use our fancy decorators to take care of the boring stuff.

```js
import { threshold, expose } from '@thresholds/core';

class NoteService {
  constructor() {
    this.notes = [];
  }

  @expose('http', { route: '/notes', method: 'post' })
  addNote(note) {
    this.notes.push;
  }

  @expose('http', { route: '/notes', method: 'get' })
  getNotes() {
    return this.notes;
  }
}
```

We can then start the service up with a simple call:

```js
const thresholds = require('@thresholds/core');
const HttpExposer = require('@thresholds/http-exposer');

thresholds.useExposer('http', new HttpExposer(9080));

await thresholds.exposeInstance(new NoteService(), {
  route: '/schema',
  method: 'get'
});
```

And that's it, we are now exposing our chatserver over http. This is already pretty handy, but things get even easier in the client:

```ts
import * as thresholds from '@thresholds/core';
import { HttpConsumer } from '@thresholds/http-consumer';

thresholds.useConsumer('http', new HttpConsumer());

const chatApi = await thresholds.consume<ChatApi>('http', {
  url: 'http://localhost:9090/manifest'
});
```

The consumption protocol is pretty convenient, as it will return an object that has ready baked implementations for the server side implementation, with the exact same names!

```js
await chatApi.addNote('hello world');
await chatApi.getNotes(); // [ 'hello world']
```

## Why Tho?

- Development speed - you can standup new services and start writing against them at a rapid pace.
- Code Reduction - removing boilerplate servers and clients reduces the amount of code you need to write, test and remember.
- Best practices - transports implementations will (eventually) represent the best patterns for their specific use case
- Portability - transports can be changed without needing to alter source code.
- Customization - You can use a pre baked transport, or create your own.
- Cross platform (eventually)

## Disclaimer

This is all still very much in the 'experimental' stage. None of the apis are even close to being concrete.

## Roadmap

Rough looking trello board here: https://trello.com/b/aXc3NZJz/thresholds
