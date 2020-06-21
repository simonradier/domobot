import { Logger } from './utils/logger';
import { HueConnector } from './connector/hue-connector';

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
