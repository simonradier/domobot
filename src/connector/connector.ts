import { DomoObject } from "../iot/domo-object"

export abstract class Connector {
    public abstract discover() : Array<DomoObject>;

}