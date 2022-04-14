import * as dotenv from "dotenv";
import axios from "axios";
import { ResponseData } from "../interfaces/doublegis.interface";
dotenv.config({ path: process.cwd() + "/.env" });

if (!process.env.DGIS_API) throw Error("2GIS API key is not provided");

export class DoubleGisService {
  constructor() {}

  getOrgReviewsByName(
        name?: string,
        options?: {
        fields?: string[];
        coordinates?: number[];
        radius?: number;
        rubric_id?: number;
        }) {

    if (!name) throw Error("Organization name is not provided");

    options = this.initOptions(options);

    // rubric_id=6 - Образовательные учреждения
    const url = encodeURI(
      `https://catalog.api.2gis.com/3.0/items?q=${name}&rubric_id=${
        options.rubric_id
      }&type=branch&point=${options.coordinates?.join(",")}&radius=${
        options.radius
      }&fields=${options.fields?.join(",")}&key=${process.env.DGIS_API}`
    );

    return axios.get(url).then((response: { data: ResponseData }) => {
      const data = response.data;
      const result = data.result.items[0];
      return result.reviews;
    });
  }

  private initOptions(
    options?: {
        fields?: string[] | undefined;
        coordinates?: number[] | undefined;
        radius?: number | undefined;
        rubric_id?: number | undefined;
    }) {
    options ??= {};
    options.fields ??= [
      "items.reviews",
      "items.rubrics",
    ];
    options.radius ??= 50000;
    options.rubric_id ??= 232;
    // Центр ЕКБ
    options.coordinates ??= [60.583827, 56.758741];
    return options;
  }
}
