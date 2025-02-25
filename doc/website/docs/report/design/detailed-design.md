---
sidebar_position: 40
---

# Detailed Design

In this section, the detailed design of the system is presented.

## Packages

Each provider and consumer node is composed of different packages, structured based on the clean architecture principles.

![Packages Structure](images/packages)
*Figure 1: Packages Structure*

## Domain Events

The system follows an event-driven model, and some events like **TaskEvent** are shared between the provider and consumer nodes.
In this case, a **Shared Kernel** has been created to store the domain events that are shared between the two nodes.
A particular design choice that has been made is to create interfaces for basic abstraction, such as **DomainEvent**, to make event management within the domain even more flexible and modular, keeping the concept clear for new features or developers.

### Provider Events:

![Provider Domain Events](images/provider-events)
*Figure 2: Provider Domain Events*

### Consumer Events:

![Consumer Domain Events](images/consumer-events)
*Figure 3: Consumer Domain Events*

These events are documented using the **Async API** specification.
As can be read in the Dev/Ops Section~\ref{sec:devops}, the documentation is automatically generated and published on the GitHub Pages of the repository.
In this case, accepted payloads, examples, and responses are documented to make the system more understandable for possible new developers and to make the system more usable for the user.

![Documentation Example](images/events-documentation)
*Figure 4: Documentation Example*

![Handlers and Payload Example](images/event-topics)
*Figure 5: Handlers Example*
![Payload Example](images/event-payload)
*Figure 6: Payload Example*

The same approach has been used to document the REST API (following **OpenAPI** specification), available on the GitHub Pages of the repository, which can be found [here](https://paga16-hash.github.io/anonymous-shard/).

## UML Diagrams

In the next sections, some UML diagrams are presented to show the structure of the provider and consumer node, respectively.
In particular, every subsystem is described with a class diagram with some notes to explain the main functionalities.
Some implementations of the main interfaces do not repeat all the methods for simplicity, but they are all implemented in the code.

## Provider Node

### Discovery Service

![Provider Discovery Service](images/provider-discovery-service)
*Figure 7: Provider Discovery Service*

### Metric Service

![Provider Metric Service](images/provider-metric-service)
*Figure 8: Provider Metric Service*

### Task Service

![Provider Task Service](images/provider-task-service)
*Figure 9: Provider Task Service*

An important note here is the definition of the **Evaluator**, which is used to evaluate the task and understand if the node can execute it or if it has to redirect it to another node.
As seen in the **Task Service** diagram (Figure~\ref{fig:provider-task-service}), the **Task Evaluator** is a component used by it.
It is a simple interface that has to be implemented by the user to define the evaluation logic, supporting extensibility but fixing the business logic.

![Provider Task Evaluator](images/provider-task-evaluator)
*Figure 10: Provider Task Evaluator*

## Consumer Node

### Consumer Task Service:

![Consumer Task Service](images/consumer-task-service)
*Figure 11: Consumer Task Service*

As seen in the **Consumer Task Service** diagram (Figure~\ref{fig:consumer-task-service}), the **Task Service** is the main component of the consumer node used by the **Node Service** to interact with the network.
In this case, the service is simpler than the provider one, with complementary functionalities.
An important design choice that fixed the business logic is the **Encryptor**, which can be used only to decrypt the task result.

