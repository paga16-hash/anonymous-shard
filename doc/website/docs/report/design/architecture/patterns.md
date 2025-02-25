---
title: Microservices patterns
position: 2
---
# Patterns
## Communication

Several communication patterns are used in the system. When a user needs to communicate with their node (or peer) backend to exchange information, the **Remote Procedure Invocation** (request/response) pattern is used. This follows a **one-to-one** model. In contrast, the **Asynchronous Messaging** pattern (publish/subscribe) is employed when a peer needs to notify other components about an event, state change, or action.

- For **RPC**, communication is implemented using the **REST** mechanism over the **HTTP** protocol.
- For **asynchronous messaging**, communication is event-driven.

All events and event brokers rely on **socket-based** mechanisms. The system can operate in either **anonymous** or **non-anonymous** mode, depending on the run configuration and user requirements. In **anonymous mode**, the system uses the **SOCKS5h proxy** to provide a secure communication channel over Tor.

For more technical details, refer to implementation-specific documentation.

