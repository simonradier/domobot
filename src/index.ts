import { Logger } from './utils/logger';
import { HueConnector } from './connector/hue-connector';
import { NetworkHelper } from './utils/network-helper';
import { cpuUsage } from 'process';
import { DomoBot } from './bot/domobot';

let bot = DomoBot.getInstance();

bot.init();

/*NetworkHelper.PortDiscover(80, (ip, port) => {
    console.log(ip);
    console.log(port);
});

NetworkHelper.PortDiscover(443, (ip, port) => {
    console.log(ip);
    console.log(port);
})*/
