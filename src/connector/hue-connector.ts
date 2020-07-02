import { Connector } from "./connector";
import { DomoObject } from "../iot/domo-object";
import { Logger } from "../utils/logger";
import { NetworkHelper, UPNPDevice } from "../utils/network-helper";
import * as bent from "bent";

export class HueBridge {
    public IP : string = "";
    public ID : string =  "";
}

export class HueConnector implements Connector {

    public readonly name : string = "HueConnector";
    private _UPNPDevices : Array<UPNPDevice> = new Array<UPNPDevice>();

    public async discover() : Promise<Array<DomoObject>> {
        let result : Array<DomoObject> = new Array<DomoObject>();
        NetworkHelper.UPNPDiscover(this.newUPNPDevice, "hue-bridgeid", /.*/);
        return result;
    }


    public newUPNPDevice = async (ud : UPNPDevice) => {
        Logger.info("New Hue Bridged added");
        this._UPNPDevices.push(ud);
        console.log(ud);
        let obj : any = await bent('json')('https://discovery.meethue.com');
        Logger.trace(JSON.stringify(obj));
    }

}