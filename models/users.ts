const { Store } = require('data-store');
import { User } from "typegram";

export class UsersStore extends Store {
    constructor(...args: any) {
        super({name: 'users', path: process.cwd() + '/data/users.json'});
    }

    store(user: User): void {
        if (this.has(user.id.toString()))
            return;

        this.set('users');
        console.log(this.data);
    }

    get(userId: string): User {
        return super.get(userId) as User;
    }

    getAll(): User[] {
        const res: User[] = [];

        Object.keys(this.data).forEach((uid: string) => {
            res.push(this.get(uid));
        });

        return res;
    }
}