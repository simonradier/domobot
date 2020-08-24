export abstract class DomoObject {

    //public static validator
    public ip : string = "";
    public openPorts : Array<number> = new Array<number>();
    public abstract init() : void;
    public abstract getInfo() : void;

    public constructor (ip : string, openPorts : Array<number>){
        this.ip = ip;
        this.openPorts = openPorts;
    }

    public static async create(ip : string, mac : string) : Promise<DomoObject> {
        return new Promise<DomoObject> ((resolve, reject) => {
            resolve();
        });
    }

}