import { DoubleGisService } from './../services/dgis.service';
import { YandexService } from '../services/yandex.service';
import { Telegraf } from 'telegraf';
import * as dotenv from "dotenv";
// добавляем токены в среду
dotenv.config({ path: process.cwd() + '/.env' });

if (!process.env.BOT_TOKEN)
    throw Error("Telegram token hasn't been provided");

// Singleton
export class Bot {
    private static instance: Telegraf;
    private static cs: YandexService = new YandexService();
    private static dGis: DoubleGisService = new DoubleGisService();

    private constructor() {}

    // Singleton
    public static getInstance(): Telegraf {
        if(Bot.instance)
            return Bot.instance;

        Bot.instance = new Telegraf(process.env.BOT_TOKEN as string);
        Bot.initRoutes();
        return Bot.instance;
    }

    public static initRoutes() {
        Bot.getInstance().command('start', (ctx) => {
            // На команду /start бот ответит...
            ctx.reply(
                'Приветствую! С помощью этого бота вы можете узнать информацию об интересующем вас учебном заведении!\n'+
                'Примеры запросов:\n'+
                '•УрГЭУ;\n•УрГЭУ Екатеринбург;\n•Экономический университет Екатеринбург;\n•Екатеринбург 8 марта 62 универ.\n•Harvard university');
        })

        // На любой текст бот ответит...
        Bot.getInstance().on('text', async (ctx) => {
            // Получение организации по поисковому запросу, отправленному пользователем
            const data = await Bot.cs.getOrganizationInfoByName(ctx.message.text);

            // Если ничего не нашлось
            if(data === null || data === undefined) {
                ctx.reply('Поиск не выдал результатов. Измените запрос или попробуйте позднее.');
                return;
            }

            // Деконструируем CompanyMetaData, извлекая только нужные аттрибуты
            const { name, address, url, Phones } = data.properties.CompanyMetaData;
            const phonesFormatted = Phones?.map((p) => p.formatted);

            // Создаём текст ответа без рейтинга
            let resText =
                `Название: ${name ?? 'Нет данных'}\n` +
                `Адрес: ${address ?? 'Нет данных'}\n` +
                `Веб-сайт: \n${url ?? 'Нет данных'}\n` +
                `Телефоны: \n${phonesFormatted?.join('\n') ?? 'Нет данных'}\n`;

            // Ищем заведение с таким же названием, что и в результате поиска через Yandex API, по соответствующим координатам.
            const orgReviewsData = await Bot.dGis.getOrgReviewsByName(name, {coordinates: data.geometry.coordinates, radius: 500});

            // Если есть рейтинг, то добавляем его последней строкой в ответ от бота
            if(orgReviewsData !== undefined) {
                resText += `Рейтинг 2ГИС: ${orgReviewsData.org_rating}`;
            }

            // Отправляем ответ пользователю
            ctx.reply(resText);
        });
    }
}