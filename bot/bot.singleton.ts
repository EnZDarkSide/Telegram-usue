import { ContactsService } from './../services/contacts.service';
import { Telegraf } from 'telegraf';
import * as dotenv from "dotenv";
dotenv.config({ path: process.cwd() + '/.env' });

export class Bot {
    private static botInstance: Telegraf;
    private static cs: ContactsService;

    private constructor() {}

    public static getInstance(routes?: any[]): Telegraf {
        if (!process.env.BOT_TOKEN)
            throw Error("No token provided");

        if (routes)
            Bot.initRoutes()

        Bot.cs ??= new ContactsService();
        Bot.botInstance ??= new Telegraf(process.env.BOT_TOKEN);
        return Bot.botInstance;
    }

    public static initRoutes() {
        Bot.getInstance().command('start', (ctx) => {
            ctx.reply(
                'Приветствую! С помощью этого бота вы можете узнать информацию об интересующем вас учебном заведении!\n'+
                'Примеры запросов:\n'+
                '•УрГЭУ;\n•УрГЭУ Екатеринбург;\n•Экономический университет Екатеринбург;\n•Екатеринбург 8 марта 62 универ.');
        })

        Bot.getInstance().on('text', (ctx) => {
            Bot.cs.getOrganizationInfoByName(ctx.message.text).then((data) => {
                if (!data) {
                    ctx.reply('К сожалению, поиск не дал результатов. Попробуйте изменить запрос.');
                    return;
                }

                const resText =
                    `Название: ${data.name ?? 'Неизвестно'}\n` +
                    `Адрес: ${data.address ?? 'Неизвестно'}\n` +
                    `Веб-сайт: \n${data.url ?? 'Неизвестно'}\n` +
                    `Телефоны: \n${data.Phones?.map((p: any) => p.formatted).join('\n') ?? 'Неизвестно'}\n`;
        
                ctx.reply(resText)
            })
        });
    }
}