---
title: Business Requirements
position: 1
---

# Business Requirements

## Glossary of Terms for the System

| Terms            | Meaning                                        | Synonymous        |
|------------------|------------------------------------------------|-------------------|
| Node             | A participant in the network                   | Peer              |
| Bootstrap Node   | A node that helps other nodes to join          | Seed              |
| Provider Node    | A node that performs computations              | Worker            |
| Consumer Node    | A node that submits tasks                      | Client, Submitter |
| Domain Event     | A significant occurrence in the system         | Event             |
| Task             | A computation to be performed                  | Job               |
| Task Result      | The output of a computation                    | Output            |
| Task Type        | A category of computations or jobs             | Job Type          |
| Submission       | The act of sending a task to the network       | Request           |
| Force Submission | A task that must be completed                  | Mandatory Task    |
| Result           | The output of a computation                    | Output            |
| Executor         | A component that performs a specific task type | ---               |
| Evaluator        | A task evaluator based on some criteria        | ---               |
| Metric           | Resource usage or performance indicator        | Resource Metric   |
| Discovery        | The process of finding nodes in the network    | Lookup            |
| Encryptor        | A component that encrypts or decrypts data     | ---               |

## Business Requirements

Since the concept behind the system is novel, the design must prioritize 
**extensibility** and **scalability**, ensuring that modifications and 
enhancements can be made without compromising core functionalities. Defining comprehensive business 
requirements that incorporate **software engineering best practices** while maintaining security, 
anonymity, and decentralization has been a challenging task.

One of the main challenges during the analysis phase was finding a balance between an **open and easily extensible system** and 
a **concrete proof of concept** that could be implemented within a reasonable timeframe. 
This was achieved by adhering to software engineering best practices and adopting a **DevOps approach**, 
as described in the following sections.

This section is structured into **provider** and **consumer** components, using the **use case** formalism to 
describe the requirements.  


## Provider Node

A provider node performs computations and returns the results to the consumer node that submitted the task. Before doing so, it must join the network and be able to receive tasks.

### 1. Joining the Network
- **Actor:** Provider Node  
- **Precondition:** The provider node has been started and knows the address of a bootstrap node.  
- **Post condition:** The provider node is part of the network and can receive tasks.  
- **Flow:** The provider node sends an event message to the bootstrap node to join the network.  
- **Main Success Scenario:** The provider node receives a response from the bootstrap node with randomly selected peers and joins the network.  
- **Extensions:** If the bootstrap node is unreachable, the provider retries after a set interval or attempts to join through another bootstrap node.  

### 2. Discovering Nodes
- **Actor:** Provider Node  
- **Precondition:** The provider node is part of the network.  
- **Post condition:** The provider node knows some peers in the network.  
- **Flow:** The provider node sends a _Discover Event_ at intervals to discover peers, following Distributed Hash Table (DHT) principles.  
- **Main Success Scenario:** The provider node receives responses from peers in the network.  
- **Extensions:** The provider node fails to discover peers.  

### 3. Metric Sharing
- **Actor:** Provider Node  
- **Precondition:** The provider node is part of the network.  
- **Post condition:** The provider node has shared its metrics with the network.  
- **Flow:** The provider node sends a _Metric Available Event_ to share its metrics.  
- **Main Success Scenario:** The provider node receives an acknowledgment and, if known, peer metrics.  
- **Extensions:** The provider node fails to share its metrics and retries after a set interval.  

### 4. Task Receiving
- **Actor:** Provider Node  
- **Precondition:** The provider node is part of the network.  
- **Post condition:** The provider node has received a task.  
- **Flow:** The provider node receives a _Task Event_ from a consumer node.  
- **Main Success Scenario:** The provider node receives the task and begins evaluation.  
- **Extensions:** The task reception fails, and the task is considered failed.  

### 5. Task Evaluation
- **Actor:** Provider Node  
- **Precondition:** The provider node has received a task.  
- **Post condition:** The provider knows if it can execute the task.  
- **Flow:** The provider evaluates the task using a _Task Evaluator_ based on a predefined algorithm.  
- **Main Success Scenario:** The provider node determines it can execute the task and begins computation.  
- **Extensions:** If other peers have better metrics, the provider redirects the task to them, forcing execution.  

### 6. Task Execution
- **Actor:** Provider Node  
- **Precondition:** The provider node has received and evaluated a task.  
- **Post condition:** The provider has executed the task, stored the result, and returned the content identifier to the consumer node.  
- **Flow:** The provider executes the task, stores the result on IPFS, and sends the content identifier to the consumer node.  
- **Main Success Scenario:** The provider node successfully starts computation.  
- **Extensions:** Task execution fails, and an error is sent to the consumer node.  

### 7. Task Result Storage
- **Actor:** Provider Node  
- **Precondition:** The provider node has executed the task and has the result.  
- **Post condition:** The result is encrypted and stored on IPFS.  
- **Flow:** The provider encrypts the result with the consumer’s public key and stores it on IPFS.  
- **Main Success Scenario:** The result is securely stored, and the content identifier is sent to the consumer node.  
- **Extensions:** The result cannot be stored, and the task is considered failed.  

---

## Consumer Node

A consumer node submits tasks to the network and retrieves the results. Before submitting a task, it must know at least one peer in the network.

### 1. Submitting a Task
- **Actor:** Consumer Node  
- **Precondition:** The consumer has a task, a generated key pair for encryption, and a provider node address.  
- **Post condition:** The task has been submitted to the network.  
- **Flow:** The consumer sends a _Task Submission Event_ with task details and the public key for encryption.  
- **Main Success Scenario:** The consumer receives an acknowledgment and the content identifier of the task.  
- **Extensions:** The task submission fails, and the consumer retries after a set interval.  

### 2. Consulting Task State
- **Actor:** Consumer Node  
- **Precondition:** The consumer has submitted a task.  
- **Post condition:** The consumer knows the state of the task.  
- **Flow:** The consumer consults the network for task status.  
- **Main Success Scenario:** The consumer receives a response with the task state.  

### 3. Retrieving Task Result
- **Actor:** Consumer Node  
- **Precondition:** The task has been completed, and the content identifier has been received.  
- **Post condition:** The consumer has decrypted the result.  
- **Flow:** The consumer retrieves the task result from IPFS using the content identifier.  
- **Main Success Scenario:** The consumer decrypts the result using the private key.  
- **Extensions:** The consumer fails to retrieve the result and retries after a set interval.  

### 4. Storing Task Result Locally
- **Actor:** Consumer Node  
- **Precondition:** The consumer has retrieved and decrypted the result.  
- **Post condition:** The result is stored locally.  
- **Flow:** The consumer securely stores the result locally.  
- **Main Success Scenario:** The result is successfully stored.  




