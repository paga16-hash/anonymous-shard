import {config} from 'dotenv'
import {MetricServiceImpl} from "./application/services/impl/MetricServiceImpl.js";
import {NodeServiceImpl} from "./application/services/impl/NodeServiceImpl.js";
import {NodeService} from "./application/services/NodeService.js";

config({path: process.cwd() + '/../.env'})

const nodeService: NodeService = new NodeServiceImpl(new MetricServiceImpl());

//nodeService.subscribeToMetrics();
