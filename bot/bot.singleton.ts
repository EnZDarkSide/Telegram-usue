import { DoubleGisService } from './../services/dgis.service';
import { ContactsService } from './../services/contacts.service';
import { Telegraf } from 'telegraf';
import * as dotenv from "dotenv";
import { Reviews } from '../interfaces/doublegis.interface';
dotenv.config({ path: process.cwd() + '/.env' });

export class Bot {
    private static instance: Telegraf;
    private static cs: ContactsService;
    private static dGis: DoubleGisService;

    private constructor() {}

    public static getInstance(): Telegraf {
        if (!process.env.BOT_TOKEN)
            throw Error("No token provided");

        if(Bot.instance)
            return Bot.instance;

        Bot.cs = new ContactsService();
        Bot.dGis = new DoubleGisService();
        Bot.instance = new Telegraf(process.env.BOT_TOKEN);
        Bot.initRoutes();
        return Bot.instance;
    }

    public static initRoutes() {
        Bot.getInstance().command('start', (ctx) => {
            ctx.reply(
                'Приветствую! С помощью этого бота вы можете узнать информацию об интересующем вас учебном заведении!\n'+
                'Примеры запросов:\n'+
                '•УрГЭУ;\n•УрГЭУ Екатеринбург;\n•Экономический университет Екатеринбург;\n•Екатеринбург 8 марта 62 универ.\n•Harvard university');
        })

        Bot.getInstance().on('text', (ctx) => {
            Bot.cs.getOrganizationInfoByName(ctx.message.text).then((data) => {
                if (!data) {
                    ctx.reply('К сожалению, поиск не дал результатов. Попробуйте изменить запрос.');
                    return;
                }

                const CompanyMetaData = data.properties.CompanyMetaData;
                const phones = CompanyMetaData.Phones?.map((p) => p.formatted);

                Bot.dGis.getOrgReviewsByName(CompanyMetaData.name, {coordinates: data.geometry.coordinates, radius: 500}).then((reviews: Reviews) => {
                    const resText =
                        `Название: ${CompanyMetaData.name ?? 'Неизвестно'}\n` +
                        `Адрес: ${CompanyMetaData.address ?? 'Неизвестно'}\n` +
                        `Веб-сайт: \n${CompanyMetaData.url ?? 'Неизвестно'}\n` +
                        `Телефоны: \n${phones?.join('\n') ?? 'Неизвестно'}\n` +
                        `Рейтинг: ${reviews.org_rating}⭐`;

                    ctx.reply(resText);
                });
            });
        });
    }
}