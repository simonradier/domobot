import domoconfig from "../domoconfig.json"

export enum LogLevel {
    Debug = 0,
    Trace,
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

