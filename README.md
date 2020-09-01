# Threshold.js
A platform & protocol independent proposal for RPC based service publishing, based on decorators.

## What?

A threshold is some class or object that has been exposed over some transport to make it callable via a remote client. 

A consumer can 'discover' a threshold, and automatically generate a dynamic client using the discovery API. No need to generate code, or manually implement a client.

## Show Me

Imagine a very simple http service that allows consumers to post and read notes.

Normally, you would either manually write or generate explicit code to do so.

However, to speed things up a bit, we can use our fancy decorators to take care of the boring stuff.

```js
@manifest({
    transport: 'http',
    options: {
        route: '/manifest',
        method: 'get'
    }
});
class NoteService {
    constructor() {
        this.notes = [];
    }

    @function({
        transport: 'http',
        options: {
            route: '/notes',
            method: 'post'
        }
    })
    addNote(note) {
        this.notes.push
    }

    @function({
        transport: 'http',
        options: {
            route: '/notes',
            method: 'get'
        }
    })
    getNotes() {
        return this.notes;
    }
}
```

We can then start the service up with a simple call:

```js
await createThreshold(new ChatServer(new NoteService()), {
    transports: {
        http: new HttpTransportServer(9080)
    }
});
```
And that's it, we now have a running http server. This is already pretty handy, but gets even more interesting in the client:

```js
const chatApi = await discoverThreshold<ChatApi>({
    transports: {
        http: new HttpTransport()
    },
    manifest: {
        transport: 'http',
        options: {
            manifestUrl: 'http://localhost:9090/manifest'
        }
    }
});
```

The discovery mechanism is smart, it will return an object that has ready baked implementations for the server side implementation:

```js
await chatApi.addNote('hello world');
await chatApi.getNotes() // returns all notes posted, including 'hello world'
```

## Why Tho?

* Development speed - you can standup new services and start writing against them at a rapid pace.
* Code Reduction - removing boilerplate servers and clients reduces the amount of code you need to write, test and remember.
* Best practices - transports implementations will (eventually) represent the best patterns for their specific use case
* Cross platform (eventually) 

## Disclaimer
This is all still very much in the 'experimental' stage. None of the apis are even close to being concrete, this repo is overdue a conversion to a monorepo, and the build is completley immature.

## Roadmap 

Rough looking trello board here: https://trello.com/b/aXc3NZJz/thresholds

