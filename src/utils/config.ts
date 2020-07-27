import domoconfig from "../domoconfig.json"

export enum LogLevel {
    Trace = 0,
    Debug,
    Information,
    Warning,
    Error,
    Critical,
    None
}


export class Configuration {
    public static logLevel : LogLevel = LogLevel.Trace;
    public static networkInterface : string = domoconfig.networkInterface;
    public static networkMask : string = domoconfig.networkMask;
    public static networkLocalIp : string = domoconfig.networkLocalIp;
}

