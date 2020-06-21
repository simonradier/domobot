import { Logger } from './utils/logger';

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

let t = new Toto();
t.test();
