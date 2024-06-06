## Features

- **Real-Time Communication**: Instant messaging across multiple chat rooms using WebSockets.
- **Scalability**: Efficient handling of multiple chat rooms with Redis pub/sub and Kafka partitioning.
- **Reduced Latency**: Optimized message delivery and database interactions using Kafka.
- **User Authentication**: Secure login and signup functionalities.
- **Responsive Design**: User-friendly interface compatible with various devices.

## Tech Stack

### Frontend

- **React.js**: A powerful JavaScript library for building user interfaces, ensuring a responsive and dynamic user experience.

### Backend

- **Node.js & Express.js**: Provides a robust and scalable server-side framework to handle HTTP requests and WebSocket connections.

### WebSocket Communication

- **Socket.io**: Manages real-time, bi-directional communication between clients and the server, facilitating instant messaging.

### Message Brokering

- **Redis Pub/Sub**: Utilizes Redis for message brokering with `psubscribe` to handle multiple room channels efficiently. This allows the application to scale by distributing messages across various server instances.

### Data Streaming

- **Apache Kafka**: Implements Kafka for streaming chat data to the database. Partitioning by `roomId` enhances parallelism, allowing efficient handling of messages and reducing latency.

### Database

- **MongoDB**: Stores user data, chat history, and other necessary information.

## Why It Scales So Well

### Redis Pub/Sub

- **`psubscribe` for Multiple Channels**: By using `psubscribe`, the application can subscribe to multiple room channels with pattern matching, ensuring efficient message routing across different chat rooms. This reduces the overhead of managing individual subscriptions and enhances scalability.

### Kafka Partitioning

- **Partitioning by `roomId`**: Kafka’s partitioning mechanism allows messages to be distributed across multiple partitions based on `roomId`. This ensures that each room’s messages are handled in parallel, increasing throughput and reducing processing time.

- **Scalability**: Kafka’s ability to handle large volumes of data and distribute it efficiently across consumers makes it ideal for high-scale applications. The partitioning strategy ensures that message processing is parallelized, enhancing performance.

### Combined Benefits

- **Reduced Latency**: Streaming database push logic to Kafka ensures that messages are processed and stored with minimal delay, improving the real-time experience for users.
- **High Throughput**: Redis and Kafka together handle high message volumes efficiently, supporting a large number of concurrent users and chat rooms.
- **Fault Tolerance**: Both Redis and Kafka are designed to be resilient, providing high availability and reliability.
