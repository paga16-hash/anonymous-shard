---
title: Quality Attributes
position: 3
---

# Quality Attributes

The quality attributes are the non-functional requirements that the system must satisfy to be considered a good system. In this case, the most important quality attributes are security, anonymity, and decentralization. Moreover, fault tolerance and scalability are also important to make the system reliable and usable in real scenarios.

In the first part of this section, the quality attributes are divided into two sections: one for the runtime and one for the development time.

## Runtime Quality Attributes

1. **Reliability**: The system should be modular and reliable. The system should work even though some peers are faulty or not deployed.
2. **Scalability**: The system should be scalable and should support many peers.
3. **Anonymity**: The system should be anonymous, preventing data leakage.
4. **Observability**: Due to the decentralized nature and no point of control, each provider or consumer should be observable from only the involved peers.
5. **Lightweight**: The system should be minimal and lightweight to be deployed on commodity hardware (requiring no specific hardware).

## Development Time Quality Attributes

1. **Usability**: The system should be usable with a user-friendly and minimal interface.
2. **Maintainability**: The system should be maintainable, with the possibility to fix bugs and add new features without affecting the system's overall functionality.
3. **Deployability**: New versions of the software should be deployed with minimal downtime.
4. **Modifiability**: The system should be modifiable, with the possibility to add new features or modify existing ones without affecting all modules or the overall system functionality.
5. **Isolation**: The components composing the system should be isolated and independent from each other, to avoid cascading failures or bugs.

## Quality Scenarios

In this section, quality attributes scenarios are presented following the *Stimulus-Response* formalism. This model is used to describe the system's behavior in different scenarios and to understand how the system should behave in real situations.

1. **Scalability**:
    - **Stimulus**: An unexpected increase in the number of providers and consumers in the network.
    - **Stimulus Source**: Many users join the network simultaneously.
    - **Environment**: During peak usage hours or when a new feature is released.
    - **Artifact**: The discovery system.
    - **Response**: The discovery mechanism should support the increased load without generating too much traffic that can slow down the network.
    - **Response Measure**: The system should be able to discover new peers in a reasonable amount of time and without overloading.

2. **Availability**:
    - **Stimulus**: A critical failure occurs, and a service becomes unavailable.
    - **Stimulus Source**: A hardware failure or a network outage.
    - **Environment**: The system is in its normal operational state.
    - **Artifact**: The peer that becomes unavailable.
    - **Response**: The system automatically detects the failure and retries the communication with the peer for a certain amount of time with increasing intervals.
    - **Response Measure**: The system recognizes the failure after the retries and the peer is considered unavailable.

3. **Reliability**:
    - **Stimulus**: A software fault occurs in one of the system's services.
    - **Stimulus Source**: An unexpected software bug causes a service to fail.
    - **Environment**: The system is running in a production environment in its normal operational state.
    - **Artifact**: The affected peer(s).
    - **Response**: The system automatically detects the failure and restarts or blocks itself, depending on the user choice, and tries to maintain overall network stability.

4. **Observability**:
    - **Stimulus**: I want to check the discovery state of a provider or a state of a submitted task from a consumer.
    - **Stimulus Source**: The monitoring system of each peer or something unexpected in the system.
    - **Environment**: The system is running in a production environment in its normal operational state.
    - **Artifact**: The peer's monitoring infrastructure.
    - **Response**: The system provides real-time dashboards for checking discovery state or task state.

5. **Maintainability**:
    - **Stimulus**: A vulnerability is reported.
    - **Stimulus Source**: A user submits a vulnerability report or automated tools detect a vulnerability.
    - **Environment**: The system is running in a production environment in its normal operational state.
    - **Artifact**: The affected component.
    - **Response**: A new fix, if possible, is applied to the affected component.
    - **Response Measure**: The fix is applied and deployed to production following the gravity of the issue.

6. **Deployability**:
    - **Stimulus**: A new version of the software is ready for deployment.
    - **Stimulus Source**: The development of the new release has been completed.
    - **Environment**: The system is in its normal operational state and a new version is ready for deployment.
    - **Artifact**: The peer that has to be updated.
    - **Response**: The new version is deployed minimizing downtime and without affecting other peers.

7. **Modularity**:
    - **Stimulus**: A new feature to a module or an entire module needs to be added to the system.
    - **Stimulus Source**: A product enhancement, a change in requirements, a bug fix, or a new feature.
    - **Environment**: The system is in its normal operational state, and the new part of the system is ready for deployment.
    - **Artifact**: The specific module that will be modified and their dependencies.
    - **Response**: New feature added without affecting other modules or the overall system functionality.

In this case, the quality attributes scenarios can be considered too much for a simple prototype, but they are useful to understand the desired system's behavior in real scenarios. They represent a base for the system's testing and validation, and they can be used to expand the system in the future. Some of them, like scalability and availability, are fundamental for this type of system, and they have been considered during the development phase. More in the testing chapter can be found about how these scenarios have been tested.
