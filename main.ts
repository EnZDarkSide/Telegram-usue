import { routes } from './bot/bot.routing';
import { Bot } from './bot/bot.singleton';
// Init bot instance
Bot.initRoutes(routes);
const bot = Bot.getInstance();
bot.launch();