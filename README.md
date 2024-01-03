# Meteor with React Native(expo) and Type-safe RPCs


In this example, we have a Meteor server(`server/`) and a React Native client(root).

You can think of the Meteor server as a backend/dashboard server, and the React Native client as a frontend client.


## Keypoints

- We are using [expo](https://expo.io/) to build the React Native app.
- We are using [meteor-react-native](https://github.com/meteorrn/meteor-react-native) to connect to the Meteor server.
- We are using [meteor-rpc](https://github.com/Grubba27/meteor-rpc) with [zod](https://zod.dev/) to define type-safe RPCs between the Meteor server and the React Native client.



### How we make RPCs type-safe

You can check the `meteor-proxy.ts` file in the `root`, there we define how the JavaScript proxy should be generated.

Our Server code can be found in `server/main.ts`. There we define the RPCs and their types.

```ts

const server = createModule()
  .addMethod('echo', z.string(), (echo) => {
    console.log('from the server:', echo);
    return echo;
  })
  .addMethod("hello", z.undefined(), () => {
    console.log("from the server: hello");
    return "hello";
  })
  .build();

export type Server = typeof server;

```

then in the client we can use the RPCs like this:

```ts

import Meteor from "@meteorrn/core";
import { createClient } from "./meteor-proxy";
import type { Server } from "./server/server/main";

Meteor.connect("wss://localhost:3000/websocket", { // you can use your own server here
  AsyncStorage: {
    getItem: SecureStore.getItemAsync,
    setItem: SecureStore.setItemAsync,
    removeItem: SecureStore.deleteItemAsync,
  },
});

const server = createClient<Server>();


server. // you can see the RPCs here that we defined in the server

```

## Demo:

[![Video](https://github.com/Grubba27/meteor-rn-rpc/assets/70247653/70247653/35e44b70-6bfa-41db-aaac-d43cbd384d32)](https://youtu.be/7GvcoRP3oqM)
