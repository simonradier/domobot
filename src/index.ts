import { Logger } from './utils/logger';
import { HueConnector } from './connector/hue-connector';
import { Network } from './utils/network';

let c : HueConnector = new HueConnector();

c.discover();



