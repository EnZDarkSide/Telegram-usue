import { DoubleGisService } from './../services/dgis.service';
import { ContactsService } from '../services/yandex.service';
import { Telegraf } from 'telegraf';
import * as dotenv from "dotenv";
dotenv.config({ path: process.cwd() + '/.env' });

if (!process.env.BOT_TOKEN)
    throw Error("Telegram token hasn't been provided");

export class Bot {
    private static instance: Telegraf;
    private static cs: ContactsService = new ContactsService();
    private static dGis: DoubleGisService = new DoubleGisService();

    private constructor() {}

    public static getInstance(): Telegraf {
        if(Bot.instance)
            return Bot.instance;

        Bot.instance = new Telegraf(process.env.BOT_TOKEN as string);
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

        Bot.getInstance().on('text', async (ctx) => {
            const data = await Bot.cs.getOrganizationInfoByName(ctx.message.text);

            if(data === null || data === undefined) {
                ctx.reply('Поиск не выдал результатов. Измените запрос или попробуйте позднее.');
                return;
            }

            const { name, address, url, Phones } = data.properties.CompanyMetaData;
            const phonesFormatted = Phones?.map((p) => p.formatted);

            let resText =
                `Название: ${name ?? 'Нет данных'}\n` +
                `Адрес: ${address ?? 'Нет данных'}\n` +
                `Веб-сайт: \n${url ?? 'Нет данных'}\n` +
                `Телефоны: \n${phonesFormatted?.join('\n') ?? 'Нет данных'}\n`;

            const orgReviewsData = await Bot.dGis.getOrgReviewsByName(name, {coordinates: data.geometry.coordinates, radius: 500});

            if(orgReviewsData !== undefined) {
                resText += `Рейтинг 2ГИС: ${orgReviewsData.org_rating}`;
            }

            ctx.reply(resText);
        });
    }
}