import { DomoObject } from "../iot/domo-object"

export abstract class Connector {
    public abstract async discover() : Promise<Array<DomoObject>>;

}