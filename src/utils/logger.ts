import chalk from 'chalk';

export class Logger {
    constructor () {

    }

    private static _getDateString() : string {
        return new Date().toISOString();

    }

    public static _getCallerInfo() : string {
        //  at [SCOPE].[CLASS].[METHOD] (/Users/critik/Documents/Projects/domobot/src/utils/logger.ts:15:21)
        let strInfo : string = (<string> (new Error().stack)).split("\n")[3].split("at ")[1];
        let leftStr : string = strInfo.split(" (")[0];
        let rightStr : string =  strInfo.split(" (")[1];
        let rightSplitInfo : string[] = rightStr.split("/");
        let className :  string = "";
        let methodname : string = "";
        let getInfo : number = 0;
        methodname = leftStr;
        let fileLineNumber : string = rightSplitInfo[rightSplitInfo.length - 1].split(/:[0-9]*\)/)[0];
        return methodname + "|" + fileLineNumber;
    }

    public static debug(msg : string) {
        console.log(chalk.magenta("[DEBUG]") + "[" +this._getDateString() + "][" + this._getCallerInfo() + "] " + msg);
    }

    public static info (msg : string) {
        console.log(chalk.blue("[INFO]") + "[" +this._getDateString() + "][" + this._getCallerInfo() + "] " + msg);
    }

    public static warn (msg : string) {
        console.log(chalk.yellow("[WARNING]") + "[" +this._getDateString() + "][" + this._getCallerInfo() + "] " + msg);
    }

    public static error (msg : string) {
        console.log(chalk.red("[ERROR]") + "[" +this._getDateString() + "][" + this._getCallerInfo() + "] " + msg);
    }

}