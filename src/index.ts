import { Logger } from './utils/logger';
import { HueConnector } from './connector/hue-connector';
import { Network } from './utils/network';

Logger.info("Hello World");

function test () : void {
    Logger.warn("test");
}

test();

class Toto {
    constructor () {
        Logger.debug("Coucou");
    }

    public test() {
        Logger.error("error");
    }
}

let c : HueConnector = new HueConnector();

c.discover();
Network.getLocalIP();


