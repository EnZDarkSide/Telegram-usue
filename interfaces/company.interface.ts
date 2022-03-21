export interface CompanyMetaData {
    id: string;
    name: string;
    address: string;
    url: string;
    Phones: {type: string, formatted: string}[];
    Categories: {class: string, name: string}[];
    Hours: {text: string};
}