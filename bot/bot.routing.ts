import { ContactsService } from './../services/contacts.service';

const cs = new ContactsService()

const onTextEvent = (ctx: any) => {
    cs.getInfoByName(ctx.message.text).then((data) => {
        console.log(data);

        const resText =
            `Название: ${data.name ?? 'Неизвестно'}\n` +
            `Адрес: ${data.address ?? 'Неизвестно'}\n` +
            `Веб-сайт: \n${data.url ?? 'Неизвестно'}\n` +
            `Телефоны: \n${data.Phones?.map((p: any) => p.formatted).join('\n') ?? 'Неизвестно'}\n`;

        ctx.reply(resText)
    })
}

export const routes: {eventName: any, action: any}[] = [
    {eventName: 'text', action: onTextEvent}
]