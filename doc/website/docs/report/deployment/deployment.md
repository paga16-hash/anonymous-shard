---
sidebar_position: 90
---

# Deployment

This section provides a brief overview of the deployment process and the necessary steps to deploy the system, but before that, the containerization process is explained.

## Containerization

The containerization process is fundamental to ensure a good deployment process. In this case, Docker is used to containerize the system, encapsulating each node in a separate container. The source code of the frontend and the backend are in different project modules to keep the system more modular but are packaged together in the same image. This approach has been followed for simplicity and to ensure that every node, including a monitoring dashboard, is encapsulated in a single container. A possible con is the fact that if some structural or architectural changes are made to the frontend, the entire Docker image needs to be rebuilt.

### Dockerfile

The created Dockerfile builds the application with two main parts: the core of the node and the relative frontend. In this case, a multi-stage build is used to optimize the image size and ensure that only the necessary dependencies are included in the final image.

1. **Base Image**: The build starts from the `node:23-slim` image. This image provides a lightweight Node.js environment.
2. **Step 1: Application Setup**: In this phase, the dependencies are installed, and the application is built.
3. **Step 2: Final Image with Tor Installation**: The final image is created with built files, and Tor is installed and configured.
4. **Step 3: Combining Startup Commands**: The startup scripts are copied, and the startup command is defined.

An important step here is the configuration of Tor, which defines the **Hidden Service** port for each node. Also, the proxy port is defined to ensure that the communication between the nodes is tunneled through the relative network.

Multiple improvements can be done in the future, such as creating a specific user for the application and defining a health check for the container.

A problem encountered was that during the first run of the container, the Tor service had not started, and therefore the hidden service address was not defined. This issue was resolved by modifying the startup scripts and the Dockerfile, which now set an environment variable containing the hidden service address.

The issue occurs only the first time because the folder in which the hidden service address is stored is a volume, so the data persists even if the container is stopped. This design choice ensures that the hidden service address remains consistent across container restarts. However, if the corresponding volume is removed, the hidden service address will change each time the container is started.

### Default Port Mapping

Since all the nodes run in the same host machine, a default port mapping was needed. The mapping is done in the Docker Compose file and is defined as follows.

#### Providers (ANONYMOUS_MODE)

1. All providers use an internal `PORT`: **3000**.
2. Their `API_PORT` values start at **4001** and increase sequentially, with mappings formatted as `<API_PORT>:4000`. This port refers to the port used by the frontend to communicate with the backend. It is important to specify this port because the frontend requests start from outside the container.
3. Frontend ports are assigned sequentially beginning at **8081** (mapped as `<frontend_port>:8080`). This port refers to the port used by the user to access the monitoring dashboard.
4. An environment variable `BOOTSTRAP_NODE` is set to "true" for the first `n` providers (where `n` equals `bootstrap_count`) and to "false" for the remainder. In this case, the address of the bootstrap node is shared with the other nodes through the startup scripts.

Container names follow the pattern `tor-provider-i`.

#### Consumers (ANONYMOUS_MODE)

1. All consumers use an internal `PORT` of **3000**.
2. Their `API_PORT` values start at **4901** and increase sequentially, with mappings as `<API_PORT>:4000`.
3. Frontend ports are assigned sequentially beginning at **8181** (mapped as `<frontend_port>:8080`).

Container names follow the pattern `tor-consumer-i`.

#### Providers (LOCAL_MODE)

1. Each provider receives a unique internal `PORT` starting at **3000** (e.g., provider-1 gets 3000, provider-2 gets 3001, ...).
2. Their `API_PORT` values begin at **4000** (e.g., provider-1: 4000, provider-2: 4001, ...) and are mapped directly (e.g., `"4000:4000`").
3. Frontend ports are assigned sequentially starting at **8080** (e.g., provider-1: `"8080:8080"`, provider-2: `"8081:8080"`, etc.).

Container names follow the pattern `local-provider-i`, and in this case, the bootstrap node variables are prefixed with `LOCAL_`.

#### Consumers (LOCAL_MODE)

1. Each consumer receives a unique internal `PORT` starting at **3900** (e.g., consumer-1: 3900, consumer-2: 3901, ...).
2. Their `API_PORT` values begin at **4900** (e.g., consumer-1: 4900, consumer-2: 4901, ...) and are mapped directly (e.g., `"4900:4900`").
3. Frontend ports are assigned sequentially starting at **8085** (e.g., consumer-1: `"8085:8080"`, consumer-2: `"8086:8080"`, etc.).

Container names follow the pattern `local-consumer-i`.

It is a bit complex to understand initially, but the main idea is to have a default port mapping that can be easily changed. Another important aspect is the exploitation of the Docker internal DNS, which allows communication between containers using the container name as the address.

**N.B.**: The scripts detailed in the next section follow this logic.

## Docker Compose

The most convenient deployment mode of the system is to use Docker containers, particularly Docker Compose to manage the orchestration of the different services. This method adds another layer of isolation, and the system can be deployed on any machine that supports Docker. This brings a lot of advantages: in the development phase, the system can be tested on different machines without issues, and in the production phase, deployment is simplified, and the system can be easily scaled.

### Prerequisite

Docker is the only prerequisite to deploy the system. Keeping the system lightweight and easy to deploy was a key design goal, and Docker was chosen for its simplicity and portability. Moreover, a Docker feature that adapts well to this system is that containers are one-shot, meaning they are temporary and can be easily replaced. This is particularly useful when thinking about Consumer Nodes. A consumer node can be deployed, get a task result, store it locally, and then be destroyed, simply by deleting the linked volume. In this way, one-shot containers improve the system's security. More details can be found in the Containerization Section~\ref{subsec:containerization}.

## Sample Scripts

To streamline the deployment process, several sample bash scripts are provided. Given the decentralized nature of this system, deploying multiple nodes on the same machine is not a logical approach. Considering that this system is a prototype, the scripts are primarily intended for the development phase, where the system can be tested on a single machine. During the production phase, no scripts are required, as the system can be deployed across different machines by simply running the appropriate containers.

The key script for running a demo on your local computer is the *anonymous-shard.sh* script. This script facilitates the creation and execution of a series of containers representing the system's nodes. Once the containers are running, interactions can be made from the Docker host through the corresponding frontend to observe and evaluate the system's behavior.

### Usages

To use the script, follow these steps:

1. **Clone**: Clone the repository or download the scripts folder from the [repository](https://github.com/paga16-hash/anonymous-shard). Source code is not needed because Docker images are already available on Docker Hub, and the externalized configuration allows the system to run without any code modification. For details, refer to the Containerization Pattern Section~\ref{subsec:patterns}.
```bash
   git clone https://github.com/paga16-hash/anonymous-shard.git
```
2. **Generate**: After giving execute permissions to the script, run the following command from the folder to generate a test Docker Compose file with the specified number of nodes.  
   With these scripts, the system can be deployed by specifying the `ANON_MODE` parameter as `false` if you want to run the system in non-anonymous mode.  
   To run the system and pin files on the IPFS filesystem, you will need a `PINATA_API_KEY` and a `PINATA_API_SECRET`, which can be obtained for free from the [Pinata](https://pinata.cloud/) website.
```bash
chmod +x ./anonymous-shard.sh
./anonymous-shard.sh generate <ANONYMOUS_MODE>
<PINATA_API_KEY> <PINATA_API_SECRET>
<DEV_API_KEY> <NUMBER_OF_BOOTSTRAP_NODES>
<NUMBER_OF_PROVIDERS> <NUMBER_OF_CONSUMERS>
```
3. **Start**: Start the system with the following command.  
   After this command, you will see Docker containers running, and you can interact with the Docker daemon or access the frontend to interact with the system.
```bash
./anonymous-shard.sh start
```
4. **Stop**: Stop the system with the following command.
```bash
./anonymous-shard.sh stop
```

To interact with the system, you can access the frontend by opening a browser and navigating to `http://localhost:<FRONTEND_PORT>`.  
Since the script follows the defined port mapping, every node can be accessed using the `localhost` address and the relative port because of the Docker port forwarding.  
While the system is running, you can submit tasks, monitor the network, and view the results through the frontend.

### Other Scripts

Since other scripts have been created to automate or simplify the development process, here is a brief explanation of them without going into details.

1. **make-requests.sh**: Automates the process of submitting tasks to the system, used to simulate user interaction with the system and different loads as analyzed in the Testing and Evaluation Chapter.
2. **evaluate.sh**: Measures average RTT time between blocks of requests.

These scripts can be found in the `scripts/other` folder of the [repository](https://github.com/paga16-hash/anonymous-shard) and can be used to automate some processes and test the system in different scenarios.
