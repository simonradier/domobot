import { Connector } from "./connector";
import { DomoObject } from "../iot/domo-object";
import dgram from "dgram";
import { Logger } from "../utils/logger";
import { NetworkHelper, UPNPDevice } from "../utils/network-helper";

export class HueConnector implements Connector {

    public readonly name : string = "HueConnector";
    private _UPNPDevices : Array<UPNPDevice> = new Array<UPNPDevice>();

    public async discover() : Promise<Array<DomoObject>> {
        let result : Array<DomoObject> = new Array<DomoObject>();
        NetworkHelper.UPNPDiscover(this.newUPNPDevice, "hue-bridgeid", /.*/);
        return result;
    }


    public newUPNPDevice = (ud : UPNPDevice) => {
        Logger.info("New Hue Bridged added");
        this._UPNPDevices.push();
    }

}