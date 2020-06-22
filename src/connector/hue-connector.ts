import { Connector } from "./connector";
import { DomoObject } from "../iot/domo-object";
import dgram from "dgram";
import { Logger } from "../utils/logger";
import { Network } from "../utils/network";

export class HueConnector implements Connector {
    public async discover() : Promise<Array<DomoObject>> {
        let result : Array<DomoObject> = new Array<DomoObject>();
        let client : dgram.Socket = dgram.createSocket("udp4");
        let address : string = await Network.getLocalIP();
        let broadcast : string = await Network.getBroadcastAddress();

        let message = "M-SEARCH * HTTP/1.1\nHOST: " + address + ":1900\nMAN: ssdp:discover\nMX: 10\nST: ssdp:all";

        client.on("listening", () => {
            Logger.debug("UDP socket is binded on port 1900");
            client.setBroadcast(true);
            Logger.debug("broadcast activated");
            client.send(message, 0, message.length, 1900, broadcast);
        }) 

        client.on('message', this._retreiveInfo);
        client.bind(1900);
        return result;
    }

    private _getBroadcastAdresse(ip : string) : string {
        let ba = ip.split(".").splice(0,3).join(".") + ".255";
        Logger.debug("Calculating Broadcast address from " + ip + " => " + ba)
        return ba;
    }

    private _retreiveInfo(msg : Buffer, rinfo : dgram.RemoteInfo) {
        Logger.debug(msg.toString());
        Logger.debug("server:" + rinfo.address + ":" + rinfo.port);
    }
}