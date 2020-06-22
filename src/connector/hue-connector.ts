import { Connector } from "./connector";
import { DomoObject } from "../iot/domo-object";
import dgram from "dgram";
import { Logger } from "../utils/logger";

export class HueConnector {
    public discover() : Array<DomoObject> {
        let result : Array<DomoObject> = new Array<DomoObject>();
        let client : dgram.Socket = dgram.createSocket("udp4");
        let message = "M-SEARCH * HTTP/1.1\nHOST: 10.0.1.16:1900\nMAN: ssdp:discover\nMX: 10\nST: ssdp:all"
        client.on("listening", () => {
            Logger.debug("UDP socket is binded on port 1900");
            client.setBroadcast(true);
            Logger.debug("broadcast activated");
            let address = client.address().address;
            this._getBroadcastAdresse(address);
            client.send(message, 0, message.length, 1900, "10.0.1.255");
        }) 
        client.on('message', this._retreiveInfo);
        client.bind(1900);
        return result;
    }

    private _getBroadcastAdresse(ip : string) {
        Logger.debug(ip);
        let ba = ip.split(".").splice(0,3).join(".") + ".255";
        console.log(ba);
    }

    private _retreiveInfo(msg : Buffer, rinfo : dgram.RemoteInfo) {
        Logger.debug(msg.toString());
        Logger.debug("server:" + rinfo.address + ":" + rinfo.port);
    }
}