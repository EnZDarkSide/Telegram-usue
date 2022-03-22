import { Bot } from './bot/bot.singleton';
// Init bot instance
Bot.initRoutes();
const bot = Bot.getInstance();
bot.launch();