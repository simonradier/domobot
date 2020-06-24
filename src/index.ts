import { Logger } from './utils/logger';
import { HueConnector } from './connector/hue-connector';

let c : HueConnector = new HueConnector();

c.discover();



