import axios from 'axios';
import * as dotenv from "dotenv";
import { ALLOWED_CLASSES } from '../consts';
import { FeaturesEntity, OrganizationSearchResponse } from '../interfaces/yandex.interface';
dotenv.config({ path: process.cwd() + '/.env' });

if(!process.env.YANDEX_TOKEN)
    throw Error("no Yandex Api key provided");

const API_KEY = process.env.YANDEX_TOKEN;

export class ContactsService {
    public type = 'biz';
    public lang = 'ru_RU';
    public results = 10;
    public ratingSnippet = 'businessrating/1.x';

    getOrganizationInfoByName(name: string): Promise<FeaturesEntity | null> {
        if(!API_KEY)
            throw Error("no Yandex Api key provided");

        const url = encodeURI(`https://search-maps.yandex.ru/v1/?text=${name}&type=${this.type}&snippets=${this.ratingSnippet}&lang=${this.lang}&results=${this.results}&apikey=${API_KEY}`);
        return axios.get(url, { headers: {'X-Auth-Key': API_KEY}})
            .then((res: {data: OrganizationSearchResponse}) => res.data.features)
            .then(features => {
                if(!features)
                    return null;

                const companyInfo = features.filter(f => {
                    const res = f.properties.CompanyMetaData.Categories.find(c => ALLOWED_CLASSES.includes(c.class));
                    return res;
                })[0];

                return companyInfo;
        });
    }
}