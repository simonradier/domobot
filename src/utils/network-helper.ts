import os from "os";
import { Logger } from "./logger";
import dgram from "dgram";
import { Socket } from "net"
import { Observable } from "rxjs"
import { Configuration } from "./config";


export class UPNPDevice {
    public readonly data : Map<string, string>;

    constructor (data :  Map<string, string>) {
        this.data = data;
        Logger.debug("Découverte d'un nouvel objet UPNP : " + this.data.get("USN")?.split("::")[0]);
    }

    get Host(): string {
        return this.data.get("HOST") || "";
    }

    get CacheControl(): string {
        return this.data.get("CACHE-CONTROL") || "";

    }

    get Location(): string {
        return this.data.get("LOCATION") || "";
    }

    get Server(): string {
        return this.data.get("SERVER") || "";
    }

    get ST(): string {
        return this.data.get("ST") || "";
    }

    get USN(): string {
        return this.data.get("USN")?.split("::")[0] || "";
    }

    get NT(): string {
        return this.data.get("NT") || "";
    }
}

class UPNPCallBackFilter {
    constructor (public callback : (ud : UPNPDevice) => void, public filterName : string, public filterValue : string | RegExp) {
    }
}

export class NetworkHelper {

    private static _localIP : string = Configuration.networkLocalIp;
    private static _localMask : string = Configuration.networkMask;
    private static _client =  dgram.createSocket("udp4");
    private static _UPNPDevices : Array<UPNPDevice> = new Array<UPNPDevice>();
    private static _discovering = false;
    private static _UPNPdDiscoverCallBack : Array<UPNPCallBackFilter> = new Array<UPNPCallBackFilter>();

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
            if (iname.startsWith("en") || iname.startsWith("wlan") || iname.startsWith("wifi") || iname.startsWith("eth")) {
                // Regarder si possible de pas caster
                let inter = <os.NetworkInterfaceInfo[]> networkInterface[iname];
                for (let line of inter) {
                    if (line.family == "IPv4" && !line.internal) {
                        NetworkHelper._localIP = line.address;
                        NetworkHelper._localMask = line.netmask;
                    }
                }
                break;
            }           
        }    
    }

    public static async getLocalIP() : Promise<string> {
        if (NetworkHelper._localIP == "")
            await NetworkHelper.getNetworkInfo();
        return NetworkHelper._localIP;
    }

    public static async getNetMask() : Promise<string> {
        if (NetworkHelper._localIP == "")
            await NetworkHelper.getNetworkInfo();
        return NetworkHelper._localMask;
    }

    public static async getBroadcastAddress() : Promise<string> {
        if (NetworkHelper._localIP == "")
            await NetworkHelper.getNetworkInfo();
        let ba = NetworkHelper._localIP.split(".").splice(0,3).join(".") + ".255";
        Logger.debug("Calculating Broadcast address from " + this._localIP + " => " + ba)
        return ba;    
    }

    public static async UPNPDiscover(callback : (ud : UPNPDevice) => void, UPNPfield : string, expectedValue : string | RegExp)  {
        NetworkHelper._UPNPdDiscoverCallBack.push(new UPNPCallBackFilter(callback, UPNPfield, expectedValue));
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
            //Logger.trace(data);
            for (let upnp of NetworkHelper._UPNPDevices) {
                if (upnp.USN == usn) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                NetworkHelper._UPNPDevices.push(new UPNPDevice(header));
                for (let up of NetworkHelper._UPNPdDiscoverCallBack){
                    if (up.filterName != "")
                        if (NetworkHelper._UPNPDevices[NetworkHelper._UPNPDevices.length - 1].data.get(up.filterName)?.match(up.filterValue))
                            callback(NetworkHelper._UPNPDevices[NetworkHelper._UPNPDevices.length - 1]);
                        else
                            callback(NetworkHelper._UPNPDevices[NetworkHelper._UPNPDevices.length - 1]);
                }
            }
        });
        NetworkHelper._client.bind(6900, "0.0.0.0");
    }


    private static async _portCheck(host : string, port : number) : Promise<boolean> {
        return new Promise<boolean> ((resolve, reject) => {
            let socket = new Socket();
            let status : boolean = false;
            // Socket connection established, port is open
            socket.on('connect', function() { 
                status = true;
                socket.remoteAddress
                socket.end();});
            socket.setTimeout(2000);// If no response, assume port is not listening
            socket.on('timeout', function() {
                socket.destroy();
                resolve(status);
            });
            socket.on('error', function(exception) {reject(exception)});
            socket.on('close', function(exception) {resolve(status)});    
            socket.connect(port, host); 
        });
    }

    public static async PortDiscover(port : number, callback :  (ip : string, port : number) => void) : Promise<void> {
        let host = await NetworkHelper.getLocalIP();
        let network = host.split(".").splice(0,3).join(".");
        Logger.debug("network");
        for (let i = 2; i < 255; i++) {
            let ip = network + "." + i;
            await new Promise(r => setTimeout(r, 200));
            NetworkHelper._portCheck(ip, port).then((check) => {
                if (check){
                    callback(ip, port);
                    Logger.debug(ip + " has the port " + port + " open.")
                } /*else 
                    //Logger.trace(ip + " has the port " + port + " closed.")*/
            }).catch( (e) => {
                
                Logger.trace(<string> e);
            });
        }
    }

}