import os from "os";
import { rejects } from "assert";
import { Logger } from "./logger";
import { reset } from "chalk";
import dgram from "dgram";


export class UPNPDevice {
    public readonly data : Map<string, string>;

    constructor (data :  Map<string, string>) {
        this.data = data;
        Logger.debug("Découverte d'un nouvel objet UPNP : " + this.data.get("USN")?.split("::")[0]);
    }

    get Host(): string | undefined {
        return this.data.get("HOST");
    }

    get CacheControl(): string | undefined {
        return this.data.get("CACHE-CONTROL");
    }

    get Location(): string | undefined {
        return this.data.get("Location");
    }

    get Server(): string | undefined {
        return this.data.get("SERVER");
    }

    get ST(): string | undefined {
        return this.data.get("ST");
    }

    get USN(): string | undefined {
        return this.data.get("USN")?.split("::")[0];
    }

    get NT(): string | undefined {
        return this.data.get("NT");
    }
}

export class NetworkHelper {

    private static _localAdress : string = "";
    private static _localMask : string = "";
    private static _client =  dgram.createSocket("udp4");
    private static _UPNPDevices : Array<UPNPDevice> = new Array<UPNPDevice>();
    private static _discovering = false;
    private static _UPNPdDiscoverCallBack : Array<(ud : UPNPDevice) => void> = new Array<(ud : UPNPDevice) => void>();

    private static _buildHeader (data : string) : Map<string, string> {
        let result : Map<string, string> = new Map<string, string>();
        for (let line of data.split("\n")){
            line = line.replace("\r", "");
            if (line.match(": "))
                result.set(line.split(": ")[0], line.split(": ")[1]);
        }
        return result;
    }

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
                        NetworkHelper._localAdress = line.address;
                        NetworkHelper._localMask = line.netmask;
                    }
                }
            }           
        }    
    }

    public static async getLocalIP() : Promise<string> {
        if (NetworkHelper._localAdress == "")
            await NetworkHelper.getNetworkInfo();
        return NetworkHelper._localAdress;
    }

    public static async getNetMask() : Promise<string> {
        if (NetworkHelper._localAdress == "")
            await NetworkHelper.getNetworkInfo();
        return NetworkHelper._localMask;
    }

    public static async getBroadcastAddress() : Promise<string> {
        if (NetworkHelper._localAdress == "")
            await NetworkHelper.getNetworkInfo();
        let ba = NetworkHelper._localAdress.split(".").splice(0,3).join(".") + ".255";
        Logger.debug("Calculating Broadcast address from " + this._localAdress + " => " + ba)
        return ba;    
    }

    public static async UPNPDiscover(callback : (ud : UPNPDevice) => void, UPNPfield : string, expectedValue : string | RegExp)  {
        if (NetworkHelper._discovering)
            return;
        let address : string = await NetworkHelper.getLocalIP();
        let broadcast : string = await NetworkHelper.getBroadcastAddress();

        let message = "M-SEARCH * HTTP/1.1\nHOST: " + address + ":6900\nMAN: ssdp:discover\nMX: 10\nST: ssdp:all";
        NetworkHelper._client.on("listening", () => {
            Logger.debug("UDP socket is binded on port 6900");
            NetworkHelper._discovering = true;
            NetworkHelper._client.setBroadcast(true);
            Logger.debug("broadcast activated");
            NetworkHelper._client.send(message, 0, message.length, 1900, broadcast);
        }) 

        NetworkHelper._client.on('message', (msg : Buffer, rinfo : dgram.RemoteInfo) => {
            //Logger.debug("Messaged received from server:" + rinfo.address + ":" + rinfo.port);
            let data = msg.toString();
            let header = NetworkHelper._buildHeader(data);
            let usn = header.get("USN")?.split("::")[0];
            let found = false;
            for (let upnp of NetworkHelper._UPNPDevices) {
                if (upnp.USN == usn) {
                    found = true;
                    break;
                }
            }
            if (!found)
            {
                NetworkHelper._UPNPDevices.push(new UPNPDevice(header));
                if (NetworkHelper._UPNPDevices[NetworkHelper._UPNPDevices.length - 1].data.get(UPNPfield)?.match(expectedValue))
                    callback(NetworkHelper._UPNPDevices[NetworkHelper._UPNPDevices.length - 1]);
            }
        });
        NetworkHelper._client.bind(6900, address);
    }

}