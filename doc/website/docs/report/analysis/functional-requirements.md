---
title: Functional Requirements
position: 2
---

# Functional Requirements

The functional requirements are the main part of the system that has to be implemented to satisfy the business requirements.
For the same reason as above, they are split into provider and consumer sections.

The functional requirements are written exploiting the user story format, which is a way to describe the requirements in a more human-readable way.

## Provider

1. **Discover**:
    - As a **Provider**  
      **I want to** be able to join the network.  
      **So that** I can receive and send domain events.
    - As a **Provider**  
      **I want to** be able to discover some peers in the network.  
      **So that** I can know some peers in the network.

2. **Task**:
    - As a **Provider**  
      **I want to** be able to receive a task from the network.  
      **So that** I can execute it and return the result to the consumer node.
    - As a **Provider**  
      **I want to** be able to execute some type of tasks.  
      **So that** I can execute them and support most types of tasks.
    - As a **Provider**  
      **I want to** be able to evaluate a task.  
      **So that** I can decide if I can execute it or not.
    - As a **Provider**  
      **I want to** be able to redirect a task to another provider node.  
      **So that** I can forward the task to another provider node that can execute it.

3. **Result**:
    - As a **Provider**  
      **I want to** be able to store the result of a task on IPFS.  
      **So that** I can return the content identifier to the consumer node.
    - As a **Provider**  
      **I want to** be able to share my metrics with the network.  
      **So that** I can choose and be chosen to execute a task by a busy provider.

## Consumer

1. **Task**:
    - As a **Consumer**  
      **I want to** be able to submit a task to the network.  
      **So that** providers can elaborate the result, and I can receive it from the network.
    - As a **Consumer**  
      **I want to** be able to consult the state of a task.  
      **So that** I can know if the task has been completed or not.

2. **Result**:
    - As a **Consumer**  
      **I want to** be able to consult the result of a task.  
      **So that** I can retrieve the result from IPFS and decrypt it.
    - As a **Consumer**  
      **I want to** be able to store the result of a task locally.  
      **So that** I can analyze it later.  
