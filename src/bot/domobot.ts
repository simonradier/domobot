export class DomoBot {

    private static instance : DomoBot;

    public static getInstance() : DomoBot {
        if (!DomoBot.instance)
            DomoBot.instance = new DomoBot();
        return DomoBot.instance;
    }

    private constructor() { }
    /**
     * init
     */
    public init() {
        
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