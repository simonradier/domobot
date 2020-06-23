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
    public static logLevel : LogLevel = LogLevel.Debug;
}