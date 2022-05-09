import * as dotenv from "dotenv";
import axios from "axios";
import { ResponseData } from "../interfaces/doublegis.interface";
// добавляем токены в среду
dotenv.config({ path: process.cwd() + "/.env" });

if (!process.env.DGIS_API) throw Error("2GIS API key is not provided");

export class DoubleGisService {
  // Запрос на получение данных об организации (рубрики 39,42,43 - все связанные с образовательными учреждениями)
  async getOrgReviewsByName(
        name: string,
        options?: {
        fields?: string[];
        coordinates?: number[];
        radius?: number;
        rubrics_ids?: number[];
        }) {

    options = this.initOptions(options);

    // Создание ссылки для get-запроса
    const url = encodeURI(
      `https://catalog.api.2gis.com/3.0/items?q=${name}&rubric_id=${
        options.rubrics_ids!.join(',')
      }&type=branch&point=${options!.coordinates?.join(",")}&radius=${
        options!.radius
      }&fields=${options!.fields?.join(",")}&key=${process.env.DGIS_API}`
    );

    // отправка запроса и получение ответа
    let data = await axios.get(url).then((response: { data: ResponseData }) => {
      // от ответа нам нужен только параметр reviews, содержащий в себе рейтинг заведения.
      const data = response.data;
      const result = data?.result?.items[0];
      return result?.reviews;
    });

    if(data !== undefined)
      return data;

    return undefined;
  }

  private initOptions(
    options?: {
        fields?: string[] | undefined;
        coordinates?: number[] | undefined;
        radius?: number | undefined;
        rubrics_ids?: number[] | undefined;
    }) {
    options ??= {};
    options.fields ??= [
      "items.reviews",
      "items.rubrics",
    ];
    options.radius ??= 50000;
    options.rubrics_ids ??= [39,42,43];
    // Центр Екатеринбурга. Далее изменится в зависимости от результата работы Яндекс API
    options.coordinates ??= [60.583827, 56.758741];
    return options;
  }
}
