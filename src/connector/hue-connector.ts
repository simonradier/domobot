import { Connector } from "./connector";
import { DomoObject } from "../iot/domo-object";
import dgram from "dgram";
import { Logger } from "../utils/logger";
import { NetworkHelper } from "../utils/network-helper";

export class HueConnector implements Connector {

    public readonly name : string = "HueConnector";

    constructor(private _client : dgram.Socket = dgram.createSocket("udp4")){
    }

    private _buildHeader (data : string) : Map<string, string> {
        let result : Map<string, string> = new Map<string, string>();
        for (let line of data.split("\n")){
            if (line.match(": "))
                result.set(line.split(": ")[0], line.split(": ")[1]);
        }
        return result;
    }

    public async discover() : Promise<Array<DomoObject>> {
        let result : Array<DomoObject> = new Array<DomoObject>();
        let address : string = await NetworkHelper.getLocalIP();
        let broadcast : string = await NetworkHelper.getBroadcastAddress();

        let message = "M-SEARCH * HTTP/1.1\nHOST: " + address + ":6900\nMAN: ssdp:discover\nMX: 10\nST: ssdp:all";

        this._client.on("listening", () => {
            Logger.debug("UDP socket is binded on port 6900");
            this._client.setBroadcast(true);
            Logger.debug("broadcast activated");
            this._client.send(message, 0, message.length, 1900, broadcast);
        }) 

        this._client.on('message', (msg : Buffer, rinfo : dgram.RemoteInfo) => {
            this._retreiveInfo(msg, rinfo)});
        this._client.bind(6900, address);
        return result;
    }

    private _retreiveInfo(msg : Buffer, rinfo : dgram.RemoteInfo) {
        Logger.trace(msg.toString());
        Logger.debug("Messaged received from server:" + rinfo.address + ":" + rinfo.port);
        let data = msg.toString();
        let header = this._buildHeader(data);
    }
}