import { Logger } from './utils/logger';
import { HueConnector } from './connector/hue-connector';
import { NetworkHelper } from './utils/network-helper';

let c : HueConnector = new HueConnector();

c.discover();

NetworkHelper.PortDiscover(80, (ip, port) => {
    console.log(ip);
    console.log(port);
})


