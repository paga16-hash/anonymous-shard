import { createLibp2p } from 'libp2p'
import { webSockets } from '@libp2p/websockets'
import { tcp } from '@libp2p/tcp'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { kadDHT } from '@libp2p/kad-dht'
import { identify } from '@libp2p/identify'
import { SocksProxyAgent } from 'socks-proxy-agent';

import { config } from 'dotenv'
import {getSystemMetrics} from "./utils/Metrics";


config({ path: process.cwd() + '/../.env' })


const node = await createLibp2p({
    transports: [webSockets(), tcp()],
    connectionEncrypters: [noise()],
    streamMuxers: [yamux()],
    services:{
        identify: identify(),
        dht: kadDHT({
            kBucketSize: 20,
            clientMode: false           // Whether to run the WAN DHT in client or server mode (default: client mode)
        })
    }
})

node.handle('/metrics/1.0.0', async ({stream}) => {
    const metrics = await getSystemMetrics();
    const response: string = JSON.stringify(metrics);
    //TODO TO CHECK
})
    .then(r => console.log('Metrics handler registered'))
    .catch(e => console.error('Error registering metrics handler', e))


node.addEventListener('peer:discovery', (evt) => {
    console.log('Discovered %s', evt.detail.id.toString()) // Log discovered peer
})

node.addEventListener('peer:connect', (evt) => {
    console.log('Connected to %s', evt.detail.toString()) // Log connected peer
})


/*
const server: HttpServer = http.createServer(app)

const io: SocketIOServer = new SocketIOServer(server, {
  cors: {
    origin: '*'
  }
})

app.use(express.json())

const PORT: number = Number(process.env.MONITORING_PORT) || 4000

app.use((req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token: string = (authHeader && authHeader.split(' ')[1]) || ''
  if (token === process.env.DEV_API_KEY) return next()
  if (token === undefined || token === '') return res.status(403).send({ error: 'No authentication token' })
  else {
    console.log('Authentication token: ' + token)
    jwtManager.authenticate(req, res, next)
  }
})

const brokers: KafkaBroker[] = getBrokersFromEnv()

const kafkaOptions: KafkaOptions = {
  clientId: 'monitoring',
  brokers: brokers,
  groupId: 'monitoringConsumer'
}
console.log('BROKERS: ', brokers)
const kafkaMonitoring: KafkaMonitoringEventsHub = new KafkaMonitoringEventsHub(kafkaOptions)
const socketMonitoring: SocketMonitoringEventsHub = new SocketMonitoringEventsHub(io)
const monitoringEventsHub: MonitoringEventsHub = new MonitoringEventsHubImpl(
  kafkaMonitoring,
  socketMonitoring
)
new MonitoringServiceImpl(monitoringEventsHub)

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, async (): Promise<void> => {
    console.log(`Monitoring server listening on ${process.env.MONITORING_PORT}`)
  })
}*/
