export abstract class DomoObject {
    public ip : string = "";
    public openPorts : Array<number> = new Array<number>();
    public abstract init() : void;
    public abstract getInfo() : void;
}