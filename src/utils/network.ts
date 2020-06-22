import dns from "dns";
import os from "os";
import { rejects } from "assert";
import { Logger } from "./logger";

export class Network {
    public static async getLocalIP() : Promise<string> {
        return new Promise<string>((resolve, rejects) => {
            try {
                dns.lookup(os.hostname(), function (err, address, family) {
                        //require('dns').lookup(require('os').hostname(), function (err, add, fam) {
                    Logger.debug("Local hostname is : " + os.hostname);
                    Logger.debug("Local adresse is : " + address);
                    resolve(address)
                });
            } catch (e) {
                rejects(e);
            }
        });
    }
}