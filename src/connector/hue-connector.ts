import { Connector } from "./connector";
import { DomoObject } from "../iot/domo-object";
import dgram from "dgram";
import { Logger } from "../utils/logger";
import { NetworkHelper } from "../utils/network-helper";

export class HueConnector implements Connector {

    public readonly name : string = "HueConnector";

    public async discover() : Promise<Array<DomoObject>> {
        let result : Array<DomoObject> = new Array<DomoObject>();
        NetworkHelper.UPNPDiscover();
        return result;
    }

}