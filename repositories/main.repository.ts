import { DATA_SCHEME, STORE_OPTIONS } from '../consts';
import { IRepository } from "./repo.interface";
const { Store } = require('data-store');

export class MainRepository extends Store implements IRepository {
    constructor(...args: any) {
        super(...args ?? STORE_OPTIONS);

        if(Object.keys(this.data).length === 0) {
            super.set(DATA_SCHEME);
        }
    }

    // get и set будут доступны только внутри класса MainRepository
    private get(key: string): any {
        return super.get(key);
    }

    private set(key: string, value: any): any {
        return super.set(key, value);
    }

    public getCount() {
        this.set('count', this.get('count')+1);
        return this.get('count');
    }
}