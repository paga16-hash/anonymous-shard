"use strict";(self.webpackChunksite=self.webpackChunksite||[]).push([[7021],{1613:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>d,contentTitle:()=>o,default:()=>l,frontMatter:()=>r,metadata:()=>a,toc:()=>h});var t=s(4848),i=s(8453);const r={sidebar_position:90},o="Deployment",a={id:"report/deployment",title:"Deployment",description:"This section provides a brief overview of the deployment process and the necessary steps to deploy the system, but before that, the containerization process is explained.",source:"@site/docs/report/deployment.md",sourceDirName:"report",slug:"/report/deployment",permalink:"/anonymous-shard/docs/report/deployment",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:90,frontMatter:{sidebar_position:90},sidebar:"tutorialSidebar",previous:{title:"Testing and Evaluation",permalink:"/anonymous-shard/docs/report/testing"},next:{title:"Conclusions",permalink:"/anonymous-shard/docs/report/conclusions"}},d={},h=[{value:"Containerization",id:"containerization",level:2},{value:"Dockerfile",id:"dockerfile",level:3},{value:"Default Port Mapping",id:"default-port-mapping",level:3},{value:"Providers (ANONYMOUS_MODE)",id:"providers-anonymous_mode",level:4},{value:"Consumers (ANONYMOUS_MODE)",id:"consumers-anonymous_mode",level:4},{value:"Providers (LOCAL_MODE)",id:"providers-local_mode",level:4},{value:"Consumers (LOCAL_MODE)",id:"consumers-local_mode",level:4},{value:"Docker Compose",id:"docker-compose",level:2},{value:"Prerequisite",id:"prerequisite",level:3},{value:"Sample Scripts",id:"sample-scripts",level:2},{value:"Usages",id:"usages",level:3},{value:"Other Scripts",id:"other-scripts",level:3}];function c(e){const n={a:"a",br:"br",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,i.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"deployment",children:"Deployment"})}),"\n",(0,t.jsx)(n.p,{children:"This section provides a brief overview of the deployment process and the necessary steps to deploy the system, but before that, the containerization process is explained."}),"\n",(0,t.jsx)(n.h2,{id:"containerization",children:"Containerization"}),"\n",(0,t.jsx)(n.p,{children:"The containerization process is fundamental to ensure a good deployment process. In this case, Docker is used to containerize the system, encapsulating each node in a separate container. The source code of the frontend and the backend are in different project modules to keep the system more modular but are packaged together in the same image. This approach has been followed for simplicity and to ensure that every node, including a monitoring dashboard, is encapsulated in a single container. A possible con is the fact that if some structural or architectural changes are made to the frontend, the entire Docker image needs to be rebuilt."}),"\n",(0,t.jsx)(n.h3,{id:"dockerfile",children:"Dockerfile"}),"\n",(0,t.jsx)(n.p,{children:"The created Dockerfile builds the application with two main parts: the core of the node and the relative frontend. In this case, a multi-stage build is used to optimize the image size and ensure that only the necessary dependencies are included in the final image."}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Base Image"}),": The build starts from the ",(0,t.jsx)(n.code,{children:"node:23-slim"})," image. This image provides a lightweight Node.js environment."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Step 1: Application Setup"}),": In this phase, the dependencies are installed, and the application is built."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Step 2: Final Image with Tor Installation"}),": The final image is created with built files, and Tor is installed and configured."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Step 3: Combining Startup Commands"}),": The startup scripts are copied, and the startup command is defined."]}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["An important step here is the configuration of Tor, which defines the ",(0,t.jsx)(n.strong,{children:"Hidden Service"})," port for each node. Also, the proxy port is defined to ensure that the communication between the nodes is tunneled through the relative network."]}),"\n",(0,t.jsx)(n.p,{children:"Multiple improvements can be done in the future, such as creating a specific user for the application and defining a health check for the container."}),"\n",(0,t.jsx)(n.p,{children:"A problem encountered was that during the first run of the container, the Tor service had not started, and therefore the hidden service address was not defined. This issue was resolved by modifying the startup scripts and the Dockerfile, which now set an environment variable containing the hidden service address."}),"\n",(0,t.jsx)(n.p,{children:"The issue occurs only the first time because the folder in which the hidden service address is stored is a volume, so the data persists even if the container is stopped. This design choice ensures that the hidden service address remains consistent across container restarts. However, if the corresponding volume is removed, the hidden service address will change each time the container is started."}),"\n",(0,t.jsx)(n.h3,{id:"default-port-mapping",children:"Default Port Mapping"}),"\n",(0,t.jsx)(n.p,{children:"Since all the nodes run in the same host machine, a default port mapping was needed. The mapping is done in the Docker Compose file and is defined as follows."}),"\n",(0,t.jsx)(n.h4,{id:"providers-anonymous_mode",children:"Providers (ANONYMOUS_MODE)"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["All providers use an internal ",(0,t.jsx)(n.code,{children:"PORT"}),": ",(0,t.jsx)(n.strong,{children:"3000"}),"."]}),"\n",(0,t.jsxs)(n.li,{children:["Their ",(0,t.jsx)(n.code,{children:"API_PORT"})," values start at ",(0,t.jsx)(n.strong,{children:"4001"})," and increase sequentially, with mappings formatted as ",(0,t.jsx)(n.code,{children:"<API_PORT>:4000"}),". This port refers to the port used by the frontend to communicate with the backend. It is important to specify this port because the frontend requests start from outside the container."]}),"\n",(0,t.jsxs)(n.li,{children:["Frontend ports are assigned sequentially beginning at ",(0,t.jsx)(n.strong,{children:"8081"})," (mapped as ",(0,t.jsx)(n.code,{children:"<frontend_port>:8080"}),"). This port refers to the port used by the user to access the monitoring dashboard."]}),"\n",(0,t.jsxs)(n.li,{children:["An environment variable ",(0,t.jsx)(n.code,{children:"BOOTSTRAP_NODE"}),' is set to "true" for the first ',(0,t.jsx)(n.code,{children:"n"})," providers (where ",(0,t.jsx)(n.code,{children:"n"})," equals ",(0,t.jsx)(n.code,{children:"bootstrap_count"}),') and to "false" for the remainder. In this case, the address of the bootstrap node is shared with the other nodes through the startup scripts.']}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["Container names follow the pattern ",(0,t.jsx)(n.code,{children:"tor-provider-i"}),"."]}),"\n",(0,t.jsx)(n.h4,{id:"consumers-anonymous_mode",children:"Consumers (ANONYMOUS_MODE)"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["All consumers use an internal ",(0,t.jsx)(n.code,{children:"PORT"})," of ",(0,t.jsx)(n.strong,{children:"3000"}),"."]}),"\n",(0,t.jsxs)(n.li,{children:["Their ",(0,t.jsx)(n.code,{children:"API_PORT"})," values start at ",(0,t.jsx)(n.strong,{children:"4901"})," and increase sequentially, with mappings as ",(0,t.jsx)(n.code,{children:"<API_PORT>:4000"}),"."]}),"\n",(0,t.jsxs)(n.li,{children:["Frontend ports are assigned sequentially beginning at ",(0,t.jsx)(n.strong,{children:"8181"})," (mapped as ",(0,t.jsx)(n.code,{children:"<frontend_port>:8080"}),")."]}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["Container names follow the pattern ",(0,t.jsx)(n.code,{children:"tor-consumer-i"}),"."]}),"\n",(0,t.jsx)(n.h4,{id:"providers-local_mode",children:"Providers (LOCAL_MODE)"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["Each provider receives a unique internal ",(0,t.jsx)(n.code,{children:"PORT"})," starting at ",(0,t.jsx)(n.strong,{children:"3000"})," (e.g., provider-1 gets 3000, provider-2 gets 3001, ...)."]}),"\n",(0,t.jsxs)(n.li,{children:["Their ",(0,t.jsx)(n.code,{children:"API_PORT"})," values begin at ",(0,t.jsx)(n.strong,{children:"4000"})," (e.g., provider-1: 4000, provider-2: 4001, ...) and are mapped directly (e.g., ",(0,t.jsx)(n.code,{children:'"4000:4000'}),'").']}),"\n",(0,t.jsxs)(n.li,{children:["Frontend ports are assigned sequentially starting at ",(0,t.jsx)(n.strong,{children:"8080"})," (e.g., provider-1: ",(0,t.jsx)(n.code,{children:'"8080:8080"'}),", provider-2: ",(0,t.jsx)(n.code,{children:'"8081:8080"'}),", etc.)."]}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["Container names follow the pattern ",(0,t.jsx)(n.code,{children:"local-provider-i"}),", and in this case, the bootstrap node variables are prefixed with ",(0,t.jsx)(n.code,{children:"LOCAL_"}),"."]}),"\n",(0,t.jsx)(n.h4,{id:"consumers-local_mode",children:"Consumers (LOCAL_MODE)"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["Each consumer receives a unique internal ",(0,t.jsx)(n.code,{children:"PORT"})," starting at ",(0,t.jsx)(n.strong,{children:"3900"})," (e.g., consumer-1: 3900, consumer-2: 3901, ...)."]}),"\n",(0,t.jsxs)(n.li,{children:["Their ",(0,t.jsx)(n.code,{children:"API_PORT"})," values begin at ",(0,t.jsx)(n.strong,{children:"4900"})," (e.g., consumer-1: 4900, consumer-2: 4901, ...) and are mapped directly (e.g., ",(0,t.jsx)(n.code,{children:'"4900:4900'}),'").']}),"\n",(0,t.jsxs)(n.li,{children:["Frontend ports are assigned sequentially starting at ",(0,t.jsx)(n.strong,{children:"8085"})," (e.g., consumer-1: ",(0,t.jsx)(n.code,{children:'"8085:8080"'}),", consumer-2: ",(0,t.jsx)(n.code,{children:'"8086:8080"'}),", etc.)."]}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["Container names follow the pattern ",(0,t.jsx)(n.code,{children:"local-consumer-i"}),"."]}),"\n",(0,t.jsx)(n.p,{children:"It is a bit complex to understand initially, but the main idea is to have a default port mapping that can be easily changed. Another important aspect is the exploitation of the Docker internal DNS, which allows communication between containers using the container name as the address."}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"N.B."}),": The scripts detailed in the next section follow this logic."]}),"\n",(0,t.jsx)(n.h2,{id:"docker-compose",children:"Docker Compose"}),"\n",(0,t.jsx)(n.p,{children:"The most convenient deployment mode of the system is to use Docker containers, particularly Docker Compose to manage the orchestration of the different services. This method adds another layer of isolation, and the system can be deployed on any machine that supports Docker. This brings a lot of advantages: in the development phase, the system can be tested on different machines without issues, and in the production phase, deployment is simplified, and the system can be easily scaled."}),"\n",(0,t.jsx)(n.h3,{id:"prerequisite",children:"Prerequisite"}),"\n",(0,t.jsx)(n.p,{children:"Docker is the only prerequisite to deploy the system. Keeping the system lightweight and easy to deploy was a key design goal, and Docker was chosen for its simplicity and portability. Moreover, a Docker feature that adapts well to this system is that containers are one-shot, meaning they are temporary and can be easily replaced. This is particularly useful when thinking about Consumer Nodes. A consumer node can be deployed, get a task result, store it locally, and then be destroyed, simply by deleting the linked volume. In this way, one-shot containers improve the system's security. More details can be found in the Containerization Section."}),"\n",(0,t.jsx)(n.h2,{id:"sample-scripts",children:"Sample Scripts"}),"\n",(0,t.jsx)(n.p,{children:"To streamline the deployment process, several sample bash scripts are provided. Given the decentralized nature of this system, deploying multiple nodes on the same machine is not a logical approach. Considering that this system is a prototype, the scripts are primarily intended for the development phase, where the system can be tested on a single machine. During the production phase, no scripts are required, as the system can be deployed across different machines by simply running the appropriate containers."}),"\n",(0,t.jsxs)(n.p,{children:["The key script for running a demo on your local computer is the ",(0,t.jsx)(n.em,{children:"anonymous-shard.sh"})," script. This script facilitates the creation and execution of a series of containers representing the system's nodes. Once the containers are running, interactions can be made from the Docker host through the corresponding frontend to observe and evaluate the system's behavior."]}),"\n",(0,t.jsx)(n.h3,{id:"usages",children:"Usages"}),"\n",(0,t.jsx)(n.p,{children:"To use the script, follow these steps:"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Clone"}),": Clone the repository or download the scripts folder from the ",(0,t.jsx)(n.a,{href:"https://github.com/paga16-hash/anonymous-shard",children:"repository"}),". Source code is not needed because Docker images are already available on Docker Hub, and the externalized configuration allows the system to run without any code modification. For details, refer to the Containerization Pattern Section."]}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"   git clone https://github.com/paga16-hash/anonymous-shard.git\n"})}),"\n",(0,t.jsxs)(n.ol,{start:"2",children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Generate"}),": After giving execute permissions to the script, run the following command from the folder to generate a test Docker Compose file with the specified number of nodes.",(0,t.jsx)(n.br,{}),"\n","With these scripts, the system can be deployed by specifying the ",(0,t.jsx)(n.code,{children:"ANON_MODE"})," parameter as ",(0,t.jsx)(n.code,{children:"false"})," if you want to run the system in non-anonymous mode.",(0,t.jsx)(n.br,{}),"\n","To run the system and pin files on the IPFS filesystem, you will need a ",(0,t.jsx)(n.code,{children:"PINATA_API_KEY"})," and a ",(0,t.jsx)(n.code,{children:"PINATA_API_SECRET"}),", which can be obtained for free from the ",(0,t.jsx)(n.a,{href:"https://pinata.cloud/",children:"Pinata"})," website."]}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"chmod +x ./anonymous-shard.sh\n./anonymous-shard.sh generate <ANONYMOUS_MODE>\n<PINATA_API_KEY> <PINATA_API_SECRET>\n<DEV_API_KEY> <NUMBER_OF_BOOTSTRAP_NODES>\n<NUMBER_OF_PROVIDERS> <NUMBER_OF_CONSUMERS>\n"})}),"\n",(0,t.jsxs)(n.ol,{start:"3",children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Start"}),": Start the system with the following command.",(0,t.jsx)(n.br,{}),"\n","After this command, you will see Docker containers running, and you can interact with the Docker daemon or access the frontend to interact with the system."]}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"./anonymous-shard.sh start\n"})}),"\n",(0,t.jsxs)(n.ol,{start:"4",children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Stop"}),": Stop the system with the following command."]}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"./anonymous-shard.sh stop\n"})}),"\n",(0,t.jsxs)(n.p,{children:["To interact with the system, you can access the frontend by opening a browser and navigating to ",(0,t.jsx)(n.code,{children:"http://localhost:<FRONTEND_PORT>"}),".",(0,t.jsx)(n.br,{}),"\n","Since the script follows the defined port mapping, every node can be accessed using the ",(0,t.jsx)(n.code,{children:"localhost"})," address and the relative port because of the Docker port forwarding.",(0,t.jsx)(n.br,{}),"\n","While the system is running, you can submit tasks, monitor the network, and view the results through the frontend."]}),"\n",(0,t.jsx)(n.h3,{id:"other-scripts",children:"Other Scripts"}),"\n",(0,t.jsx)(n.p,{children:"Since other scripts have been created to automate or simplify the development process, here is a brief explanation of them without going into details."}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"make-requests.sh"}),": Automates the process of submitting tasks to the system, used to simulate user interaction with the system and different loads as analyzed in the Testing and Evaluation Chapter."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"evaluate.sh"}),": Measures average RTT time between blocks of requests."]}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["These scripts can be found in the ",(0,t.jsx)(n.code,{children:"scripts/other"})," folder of the ",(0,t.jsx)(n.a,{href:"https://github.com/paga16-hash/anonymous-shard",children:"repository"})," and can be used to automate some processes and test the system in different scenarios."]})]})}function l(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}}}]);