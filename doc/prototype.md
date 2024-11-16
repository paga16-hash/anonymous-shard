
# Progetto Peer-to-Peer con NodeJS, Tor e IPFS

## Scelte Tecnologiche

### Proxy SOCKS5 e Tor
L'infrastruttura si basa su una rete peer-to-peer che utilizza il proxy SOCKS nella sua 5ª versione per il collegamento dei client, componente chiave delle reti Tor, per garantire anonimato e sicurezza nella comunicazione tra i nodi.

### Linguaggio di Programmazione: NodeJS
NodeJS per la sua facilità di utilizzo, ed essendo un linguaggio con il quale sono già familiare,  consentendo poi di concentrarsi sulle funzionalità del progetto.
Sono inoltre disponibili librerie come LibP2P e IPFS per la creazione di nodi P2P. 
## Architettura Peer-to-Peer

Diverse tecnologie sono state esplorate per la gestione dei nodi nella rete P2P:

- **Bootstrap Node**: Un nodo di ingresso che risponde con la lista dei peer presenti nella rete. **Scartato** poiché rappresenta un single-point-of-failure, non adatto per questo sistema.
- **Decentralized Registry**: Un file condiviso con tutti i nodi contenente gli indirizzi di ogni peer. **Scartato** per implementare soluzioni più realistiche e robuste.
- **Peer Exchange Protocol**: Protocollo di discovery adatto a reti piccole, ma meno scalabile. È stato attentamente considerato.
- **Distributed Hash Table (DHT)**: Scelto per la sua scalabilità. Utilizza un subset dei peer, ma consente di raggiungere tutti i nodi tramite richieste successive. 
- Potenziale vulnerabilità al Sybil Attack, che sarà curioso  da testare. 

### Pro e Contro della DHT
- **Pro**: Efficienza nella discovery (O(log n) in termini di hop tra i nodi).
- **Contro**: Soffre di cold start e Sybil Attack, ma mantiene maggiore anonimato poiché non richiede di conoscere tutti i peer.

Non volevo fare una scelta che obbligasse tutti i peer della rete a conoscere tutti gli altri.   
### Deployment e Containerizzazione
I nodi saranno containerizzati per semplificare il processo di sviluppo e deployment.
In particolare anche per la gestione di tor. 
Ho dato un'occhiata e ho visto come basta mantenere nel volume collegato al container il file di configurazione con all'interno la chiave privata per mantenere lo stesso indirizzo .onion, comodo per la fase di development. 


## Storage: IPFS

Per lo storage dei dati, è stato scelto **IPFS** per la sua natura distribuita e l'utilizzo del concetto di "pinning" e "Content Identifier" (CID), che associa ogni file salvato a un identificatore senza dipendere da una posizione fisica. 
Sono stati considerati anche:
- **StorJ**: Scartato per la natura proprietaria.
- **ZeroNet**: Non approfondito a causa dei costi in criptovaluta.

Per il ritorno dei risultati di una task, si sta valutando l'idea di salvare il risultato su IPFS e di restituire il CID.
Un altro approccio, ma che ancora devo valutare, è tornare direttamente il risultato al client, in questo caso pareri sono ben accetti dato che ancora per me è da esplorare.  
Ciò che però ho studiato è il meccanismo di IPFS, che permette di salvare un file e di restituire un CID, che è un hash del contenuto del file. Questo CID può essere usato per recuperare il file in qualsiasi momento, anche se il nodo che ha salvato il file non è più online.
Una problematica è che se non vengono utilizzate tecniche di crittografia il file è accessibile a chiunque conosca il CID. da evitare. 
## Metriche Monitorate

Ogni nodo monitorerà e conoscerà le seguenti metriche dei nodi vicini:
- **Pending tasks**
- **CPU cores**
- **CPU frequency**
- **GPU cores**
- **Total Memory**
- **Available Memory**

Queste metriche saranno utilizzate inizialmente per motivi di semplicità e saranno fondamentali per il reward system. 
Potrebbe essere interessante stimare il costo di una task in base alle risorse del nodo che la eseguirà.

Inoltre, per una possibile implementazione del reward system basato su risorse, si potrebbero considerare algoritmi inizialmente semplici e poi via via più complessi, come:

peer selection based on some easy metrics:

# Provider selection
bestProvider = null
lowestCost = Infinity

    for each provider in providers:
        # Calculate available resources
        availableMemory = provider.memory.free
        totalMemory = provider.memory.total
        usedMemoryPercentage = provider.memory.used / totalMemory
        cpuLoad = provider.cpu.load
        numCores = provider.cpu.cores

        # Determine task queue factors
        activeTasks = provider.activeTasks
        pendingTasks = provider.pendingTasks
        taskLoad = activeTasks + pendingTasks

        # Calculate a cost metric based on CPU, memory, and task queue load
        cost = (
            (1 - usedMemoryPercentage) * weightMemory  # Higher free memory is better
            + (1 - (cpuLoad / 100)) * weightCPU  # Lower CPU load is better
            + (1 / (1 + taskLoad)) * weightTasks  # Fewer tasks is better
        )

        # If the calculated cost is lower than the lowestCost, update the bestProvider
        if cost < lowestCost:
            lowestCost = cost
            bestProvider = provider

    return bestProvider


In piu, si potrebbe pensare di implementare un sistema di priorità per gli utenti che richiedono task, in modo da poter pagare un reward maggiore per task prioritarie.

## Task Iniziali

Per i primi test, le task scelte saranno semplici operazioni, come:
- Operazioni aritmetiche di base
- Calcolo del codice fiscale
- Test su password (confronto di un hash con dizionari noti)
Altre idee sono ben accette 

## Fase di Sviluppo

Per lo sviluppo si utilizzerà **Docker**. 
Si effettueranno test di correttezza avviando nodi manualmente tramite script Bash, per poi procedere con la creazione di container specifici (Provider), parametrizzati tramite file `docker-compose`.
Attraverso questo metodo, una volta che i container sono pronti, si potrà procedere con la creazione di un network di container, simulando una rete P2P nell'hardware messo a disposizione dal prof. 
Dato che il mi è vecchiotto. 
## Prototipo Iniziale

L'obiettivo iniziale è creare nodi di tipo **Provider** e **Consumer**, inizialmente solo consumer che condividono tra di loro metriche.
Il processo seguirà i principi di clean architecture e design pattern, in modo da garantire una struttura modulare e scalabile.
In questo modo rimarrà facile anche sostituire eventuali dipendenze in caso di necessità/vulnerabilità.

Successivamente, si procederà con un test della tor network mettendo in comunicazione i nodi tra di loro sulla rete. 
Prima di procedere, essendo la tor network lenta, tornerò in fase di develop locale andando a implementare un salvataggio su file. 
Anche in questo caso un eventuale reward system pootrebbe essere definire un costo sulla base della quantità di memoria da salvare, per eventuali task di salvataggio su IPFS.(?) 

## Dettagli Tecnici

Da guardare gossip pub-sub:
per trasferimento informazioni riguardanti le peer:  
confronto tra gossip pubsub o flood pubsub:
scelta del gossip dato: https://www.researchgate.net/figure/DCA-Floodsub-vs-Gossipsub-network-bandwidth-for-a-NP-version-in-kilobit-per-node-per_fig3_358957246

video gossip peer to peer di LibP2P
https://www.youtube.com/watch?v=mlrf1058ENY&list=PLuhRWgmPaHtRPl3Itt_YdHYA0g0Eup8hQ&index=4&ab_channel=IPFS


Da guardare meglio:
- **OS per la Sicurezza**: Whonix e Tails sono stati considerati come possibili sistemi operativi per il progetto. **Tails** è preferito per la possibilità di creare container con un alto livello di sicurezza e minimizzazione dei parametri necessari. In esecuzione su hardware con hardening, offre maggiore protezione.


Altro: 

- il prof per caso ha un account github? per metterlo collaboratore in caso voglia vedere il codice e gli sviluppi (problema mail da vedere su impostazioni)
- tipologia di task
- consigli? 

Flusso: finire peer to peer ->  tor -> easy ipfs -> gossip pubsub per provider selection -> generalizzazione dei task -> reward system o test? -> sibyl simulation mi piacerebbe -> considerations e scrittura


Retain the Hidden Service Directory: The private key is typically stored in the hidden service directory specified in the Tor configuration file (e.g., HiddenServiceDir /var/lib/tor/my_hidden_service/). By retaining this directory, you keep the same address across restarts.
Back Up the Private Key: If you are deploying in a Docker container, for instance, ensure that the directory where the private key resides is either part of a persistent volume or backed up.