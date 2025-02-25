<div style="text-align: center;">
  <img src="doc/logo.png" width="250" alt="Tor Logo">
</div>

# 🌐 Welcome to **Anonymous Shard**

> A decentralized and anonymous system to ensure privacy and security.  
> In this guide, you will explore the project's foundations, how to set it up, and how to contribute. Thanks :D

---

### 🚀 Introduction

This project aims to create a **completely anonymous** P2P network leveraging **Tor**, ensuring every participant
remains anonymous, while the system is decentralized with no central authority.
The goal is to support different kind of task execution, such as **file sharing**, **computational tasks**, and **data
storage**.

For now, the project is designed to be easily extensible, allowing multiple types of Task Executors to be implemented.
The current implementation is focused on easy **Sum** tasks.

#### **Key Points:**

- **Tor**: Anonymity via the Tor network.
- **IPFS**: Decentralized storage and content distribution.
- **DHT**: Distributed Hash Table for P2P communication and scalability.
- **SOCKS5**: Proxy protocol for Tor communication.
- **Docker**: Containerization for easy deployment.

---

### 🌟 Main Features

- **Anonymous Nodes**: Every node operates as a **Tor hidden service** to ensure anonymity.
- **Complete Autonomy**: Nodes autonomously join the network without predefined configurations, exploiting **DHT** for
  discovery.
- **Decentralized Storage**: **IPFS** is used for decentralized storage and content distribution.
- **Encryption**: All communications are encrypted by default and use **Tor** for anonymity, same for tasks results.
- **Decentralized Management**: There are no single points of failure. The network is fully distributed.

### 🌟 Understanding the Project

- **Provider**: A node that provides resources to the network, such as CPU, storage, and bandwidth that can execute
  tasks.
- **Consumer**: A node that requests tasks to be executed.
- **Task**: A task is a job that needs to be executed by one node.
- **Task Result**: The result of a task execution, encrypted, stored securely on IPFS.
- **Task Executor**: A component that executes tasks on a node, different types of executors can be implemented (
  composing the **Capabilities** of a provider node).
- **Task Evaluator**: A component that establish if the task is runnable on a provider node.
- **Selection Algorithm**: A mechanism to select the best provider for a task, for now simply based on available
  metrics.

---

### Anonymity mode

- **Anonymous** 🟢: Transport layer based on **Tor**.
- **Non-Anonymous** 🔴: Transport layer based on **TCP**, exposing the real IP address.

### 🌟 Future Features

- **Next Secure Rewards**: Users are rewarded in **Monero** for maintaining the network.
- **Supporter Node**: Nodes can be configured to support the network by providing additional resources, getting
  rewarded.
- **Task Executor**: Support for different types of tasks, such as **file sharing**.
- **Task Scheduler**: A scheduler to manage tasks and distribute them to nodes.
- **Optimized Provider Selection**: A mechanism to select the best provider for a task, exploiting **Supporters**.

---

## 🛠️ Project Setup

### Prerequisites

- **Docker**: To run the project in a containerized environment.

### 1. Clone the Repository

Clone the repository or download the `scripts` folder from the repository.
The source code is not needed because Docker images are already available on Docker Hub,
and the externalized configuration allows the system to run without any code modifications.
For details about the containerization phase,
please refer to the **Containerization**
section [here](https://paga16-hash.github.io/anonymous-shard/docs/report/deployment/#containerization).

```bash
git clone https://github.com/paga16-hash/anonymous-shard.git
```

### 2. Generate the Configuration

After giving execute permissions to the script, generate a test `docker-compose` file with the specified number of
nodes.

With these scripts, the system can be deployed by specifying the `ANON_MODE` parameter as `false` if you want to run the
system in **non-anonymous mode**.

To run the system and pin files on the **IPFS filesystem**, a `PINATA_API_KEY` and a `PINATA_API_SECRET` are required,
which can be obtained for free from the **[Pinata website](https://app.pinata.cloud/auth/signin)**.

```bash
chmod +x ./anonymous-shard.sh

./anonymous-shard.sh generate <ANONYMOUS_MODE>
<PINATA_API_KEY> <PINATA_API_SECRET>
<DEV_API_KEY> <NUMBER_OF_BOOTSTRAP_NODES>
<NUMBER_OF_PROVIDERS> <NUMBER_OF_CONSUMERS>
```

This will generate a `docker-compose` file with the specified number of nodes and start the system.

### 3. Start the System

Starting the system will launch the necessary Docker containers. Once started, the **frontend** can be accessed to
interact with the system.

```bash
./anonymous-shard.sh start
```

### 4. Stop the System

Stopping the system will terminate all running containers and services.

```bash
./anonymous-shard.sh stop
```

### 5. Interacting with the System

To interact with the system, open a browser and navigate to the frontend using the defined port mapping.
Every node can be accessed using `localhost` and the corresponding port due to **Docker port forwarding**.
The default port configuration used by the script can be
found [here](https://paga16-hash.github.io/anonymous-shard/docs/report/deployment/#default-port-mapping).

While the system is running, it is possible to:

- **Submit tasks**
- **Monitor the network**
- **View results** through the frontend

To simulate a task submission, click the `Submit Task` button from a consumer node frontend.

---

### Other Scripts

Additional scripts have been created to **automate** or **simplify** the development process:

- **`make-requests.sh`**: Automates the process of submitting tasks to the system, used to simulate **user interactions**
  and **different loads** as analyzed in the **Testing and Evaluation** chapter.
- **`evaluate.sh`**: Measures **average RTT time** between blocks of requests.

These scripts can be found in the **`scripts/other`** folder of the repository and can be used to automate testing and
evaluate the system in different scenarios.

---






