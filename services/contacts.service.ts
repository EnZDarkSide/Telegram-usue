import axios from 'axios';
import * as dotenv from "dotenv";
import { CompanyMetaData } from '../interfaces/company.interface';
dotenv.config({ path: process.cwd() + '/.env' });

if(!process.env.YANDEX_TOKEN)
    throw Error("no Yandex Api key provided");

const API_KEY = process.env.YANDEX_TOKEN;

export class ContactsService {
    getInfoByName(name: string): Promise<CompanyMetaData> {
        if(!API_KEY)
            throw Error("no Yandex Api key provided");

        const url = encodeURI(`https://search-maps.yandex.ru/v1/?text=${name}&type=biz&lang=ru_RU&results=1&apikey=${API_KEY}`);
        return axios.get(url, { headers: {'X-Auth-Key': API_KEY}}).then((res) => {
            const companyMD = res.data.features[0]?.properties.CompanyMetaData;
            return companyMD;
        });
    }
}