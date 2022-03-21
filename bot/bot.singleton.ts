import { ContactsService } from './../services/contacts.service';
import { Telegraf } from 'telegraf';
import * as dotenv from "dotenv";
dotenv.config({ path: process.cwd() + '/.env' });

export class Bot {
    private static instance: Telegraf;

    private constructor(cs: ContactsService) {}

    public static getInstance(routes?: any[]): Telegraf {
        if (!process.env.BOT_TOKEN)
            throw Error("No token provided");

        if (routes)
            Bot.initRoutes(routes)

        Bot.instance ??= new Telegraf(process.env.BOT_TOKEN);
        return Bot.instance;
    }

    public static initRoutes(routes: {eventName: any, action: any}[]) {
        routes.forEach((r) => {
            Bot.getInstance().on(r.eventName, r.action);
        });
    }
}