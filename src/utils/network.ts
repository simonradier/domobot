import os from "os";
import { rejects } from "assert";
import { Logger } from "./logger";

export class Network {

    private static _localAdress : string = "";
    private static _localMask : string = "";

    private static async getNetworkInfo() : Promise<void> {
        let networkInterface = os.networkInterfaces();
        let list = Object.keys(networkInterface);
        Logger.debug("Number of network interfaces : " + list.length);
        Logger.debug("List of network interfaces : " + list.join("|"));
        for (let iname of list) {
            if (iname.startsWith("en") || iname.startsWith("wlan") || iname.startsWith("wifi")) {
                // Regarder si possible de pas caster
                let inter = <os.NetworkInterfaceInfo[]> networkInterface[iname];
                for (let line of inter) {
                    if (line.family == "IPv4" && !line.internal) {
                        this._localAdress = line.address;
                        this._localMask = line.netmask;
                    }
                }
            }           
        }    
    }

    public static async getLocalIP() : Promise<string> {
        if (this._localAdress == "")
            await Network.getNetworkInfo();
        return this._localAdress;
    }

    public static async getNetMask() : Promise<string> {
        if (this._localAdress == "")
            await Network.getNetworkInfo();
        return this._localMask;
    }

    public static async getBroadcastAddress() : Promise<string> {
        if (this._localAdress == "")
            await Network.getNetworkInfo();
        let ba = this._localAdress.split(".").splice(0,3).join(".") + ".255";
        Logger.debug("Calculating Broadcast address from " + this._localAdress + " => " + ba)
        return ba;    
    }

}