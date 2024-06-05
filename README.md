# Real-Time Chat Application with Redis Pub/Sub and WebSocket Servers (In Dev Phase, Accomplished cleaner code via psubscribe in redis)

This repository contains the implementation of a real-time chat application that leverages Redis Pub/Sub and WebSocket servers to manage chat rooms and real-time messaging.

## Architecture Overview

### Components
1. **Clients**: Users connected via WebSocket to the WebSocket servers (WSS).
2. **WebSocket Servers (WSS)**: Handles client connections, manages chat rooms, and communicates with Redis Pub/Sub.
3. **Redis Pub/Sub**: Used for message distribution between WebSocket servers.

### Workflow

#### Room Creation
1. **Subscription**: WebSocket servers subscribe to a new room's channel in Redis Pub/Sub.
2. **Publication**: WebSocket servers publish to the Redis channel for the new room.
3. **Joining and Messaging**: WebSocket servers handle client join requests and messages for the new room.

#### Joining a Room
1. **Client Connection**: A client connects to a WebSocket server and requests to join a room.
2. **Subscription**: The WebSocket server subscribes to the Redis channel for the room if it hasn't already.
3. **Publication**: The WebSocket server publishes a join message to the Redis channel.
4. **Notification**: The WebSocket server notifies the client of the successful join.

#### Message Passing
1. **Client Message**: A client sends a message to a room via the WebSocket server.
2. **Publication**: The WebSocket server publishes the message to the Redis channel for the room.
3. **Broadcast**: All WebSocket servers subscribed to the room's Redis channel receive the message and broadcast it to their connected clients.

## Detailed Logic

### Room Creation

1. **Subscription to New Room**:
   - WebSocket server subscribes to the Redis channel `newroom`.
   - Publishes to the `newroom` channel indicating the creation of `r1`.
   - WebSocket server handles this internally and subscribes to the new room `r1`.

2. **Redis Pub/Sub**:
   - Receives the publication on `newroom`.
   - Subscribes WebSocket servers to `r1`.
   - WebSocket servers join `ws-r1:join` and handle `ws-r1:msg`.

### Joining a Room

1. **Client Join Request**:
   - Client connects to a WebSocket server and requests to join `r1`.
   - WebSocket server subscribes to `p/s-r1:join` and `p/s-r1:msg` if not already subscribed.
   - WebSocket server publishes a join message to the Redis channel.

2. **Redis Pub/Sub**:
   - Receives the join message on `ws-r1:join`.
   - Publishes the join message to `p/s-r1:join`.

3. **WebSocket Servers**:
   - All WebSocket servers subscribed to `p/s-r1:join` broadcast the join message to clients in `r1`.

### Message Passing

1. **Client Message**:
   - Client sends a message to `r1` via the WebSocket server.
   - WebSocket server publishes the message to the Redis channel `ws-r1:msg`.

2. **Redis Pub/Sub**:
   - Receives the message on `ws-r1:msg`.
   - Publishes the message to `p/s-r1:msg`.

3. **WebSocket Servers**:
   - All WebSocket servers subscribed to `p/s-r1:msg` broadcast the message to clients in `r1`.
