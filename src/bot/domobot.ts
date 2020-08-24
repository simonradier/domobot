import { DomoObject } from "../iot/domo-object";
import { NetworkHelper } from "../utils/network-helper";

export class DomoBot {

    private static instance : DomoBot;
    private _domoObjects : Map<string, DomoObject> = new Map<string, DomoObject>();

    public static getInstance() : DomoBot {
        if (!DomoBot.instance)
            DomoBot.instance = new DomoBot();
        return DomoBot.instance;
    }

    private constructor() { }
    /**
     * init
     */
    public async init() {
        await NetworkHelper.init();
        await this.scanNetwork();
    }

    public async scanNetwork () : Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            await NetworkHelper.PingDiscover();
            try {
                NetworkHelper.IPDevices.forEach(async (mac, ip) => {
                    this._domoObjects.set(ip, await DomoObject.create(ip, mac));
                });
            } catch(e) {
                console.log(e);
            }
        });
    }

    /**
     * start
     */
    public start() {
        
    }
    /**
     * stop
     *
     * @memberof DomoBot
     */
    public stop() {

    }
}