import { DomoObject } from "../iot/domo-object"

export abstract class Connector {

    public readonly name : string = "Default";
    public abstract async discover() : Promise<Array<DomoObject>>;

}