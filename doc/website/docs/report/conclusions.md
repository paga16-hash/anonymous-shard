---
sidebar_position: 100
---

# Conclusions

Concluding this project has been a challenging and rewarding experience. Since it was a project that I started from scratch and with no clear boundaries, difficulties and challenges to face were numerous, but the satisfaction of having completed it's huge. At the beginning of the project, the difficulties were mainly non-technical, such as defining the scope of the project and the objectives to be achieved. When a good trade-off between basic abstraction and complexity was found, the idea of the project was clear.

After the initial phase, the technical challenges were numerous. My initial intention was to focus on high-level solutions, leveraging libraries like *Libp2p* to build the network layer and concentrate on the business logic. However, the issues encountered with the network layer were more complex as explained in the Transport Layer Section and some goals could not be achieved with certainty. As a result, trade-offs were made to ensure the project's completion within the constraints by deciding to build a simple yet effective network management layer to allow nodes to communicate. Although this approach was time-consuming and not much time was spent on expanding the business logic, I believe that the overall goal of getting the idea across that an innovative and anonymous ecosystem is necessary was more crucial.

What is needed in this age is a globally recognized and widely used system that ensures privacy and anonymity, while maintaining a high level of decentralization and censorship resistance. The concept behind this prototype is to build towards such an ecosystem, where users own computational resources and can use them to perform tasks in a secure and anonymous environment. The ultimate goal is to create a stable ecosystem that can be accessed and used by anyone, without the need for a central authority overseeing the system, which is a significant strength.

This prototype serves as a foundation for expanding this concept or creating something new with the same underlying principles. The next Future Directions Section will further explore this ecosystem concept and analyze potential future extensions of the project.

Additionally, the second prototype presents a strong concept: introducing new nodes into the system to support its overall functionality. While the results are currently analyzed manually, envisioning an automated mechanism to monitor and analyze the network status in near real-time could be a very nice feature.

## Future Extensions

In this section, possible future extensions of the project are analyzed. Since this prototype is just the beginning of a larger vision for an anonymous computing ecosystem, the possibilities for future improvements are huge.

First, enhance the network layer by leveraging tested and reliable libraries, such as *Libp2p*, while refining the business logic.

If, for any reason, contributing to these libraries proves to be unsuccessful, the fallback plan is to build a custom network layer starting from the developed one for this prototype. It would be more time-consuming but very effective.

In addition to improving the network layer, expanding the business logic is essential. There are many opportunities for improvement in this regard, beginning with the expansion of the core node types and the introduction of new node typologies. The system is designed to be modular, enabling easy adaptations to meet new possible specific requirements.

If the need arises for task executors with specialized functionality, new node types could be created to handle those tasks. This flexibility ensures the system's adaptability and scalability. Furthermore, building a small but active community could greatly enhance the growth of such a system. Open-source executors or evaluators packages could be released based on the community's needs and requests. Moreover, for example, developers can create custom node types with their own business logic and integrate them into the system.

Another promising direction involves the implementation of federated learning, decentralized AI model training or other tasks. In these contexts, anonymity becomes even more crucial, as researchers may wish to conduct investigations without revealing their identity or the data they are using.

The system could be enhanced by incorporating advanced cryptographic techniques, such as homomorphic encryption and Trusted Execution Environments (TEEs). With homomorphic encryption, data privacy could be guaranteed, while TEEs would ensure the integrity of the system. These technologies could provide a significant boost to the security and privacy of the system.

Another important aspect to consider is the sustainability and attractiveness of the system to users, and for this purpose, a reward system could be introduced. This system could be implemented using [Monero](https://www.getmonero.org/get-started/what-is-monero/) or [Z-Cash](https://z.cash/) as a cryptocurrency to ensure and keep high anonymity level. This mechanism not only permits the system to be self-sustainable but also incentivizes users to participate and contribute to the network. Moreover, it allows thinking beyond the simple reward for task execution or processing. In particular, new types of nodes, designed solely to support the network, could be introduced. These supporter nodes would help maintain system consistency and ensure its continuous operation. While the rewards for these nodes would be lower than those for processing nodes, their resource requirements would also be less demanding, making them more accessible to a broader range of participants.

A reconsideration of the peer selection process and the task redirection mechanism is also necessary. To optimize task routing, a more efficient routing mechanism could be implemented, possibly leveraging new metrics provided by the Tor network or by supporters. This would allow tasks to be directed to the most optimal nodes, gaining clear improvements in the system's performances. In this case, a task classification mechanism could be introduced to weigh tasks based on their complexity and importance, introducing the concept of task priority linked also to the reward system. More metrics regarding the nodes could be provided to identify malicious nodes or sparsity in the network trying to better address the network status and the nodes' decentralization level.

An alternative approach, for which the software is not designed, could be to introduce de-anonymization mechanisms. This is the case in which the system is used for other purposes, and the involved parties need a mechanism to de-anonymize results in case of disputes or other reasons. The system should be revisited, and some Multi-Party Cryptography techniques could be introduced to achieve this result.

While this is not something I would like to see in the system, it is a possibility that should be considered for other variations. In line with this idea, I believe it could be interesting to integrate the system with a Decentralized Autonomous Organization (DAO), where participants can vote on the future directions. This integration could be interesting, but it requires a deeper analysis, as it could also present potential risks, making it a double-edged sword keeping in mind the more complex the system, the more vulnerabilities it could have.

Finally, after these considerations, I would like to underline that continuous research and development are essential for the growth and sustainability of any technology, enabling people to adapt to emerging challenges and stay safe. Through R&D and innovative solutions, it should be fundamental to ensure that systems can operate effectively in restrictive environments, such as censored countries or other challenging circumstances. I'm not sure if this system will help anyone, but I'm really proud to have thought about this topic and contributed today, as I will in my future.
