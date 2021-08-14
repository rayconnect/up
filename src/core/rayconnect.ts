import { Rayconnect } from '@iamnonroot/rayconnect-client';
import { Database } from '../../lib/core/database';
import { KeyValue } from '../../lib/interface/database';
import { Apps } from './apps';

const database = new Database<KeyValue>({ name: 'rayconnect' });

const rayconnect = new Rayconnect({
    'aid': 'main',
    'scopes': []
});


rayconnect.auth.setCallback({
    getToken: () => {
        return database.items.find((item) => item.key == 'token')?.value as string;
    },
    setToken: async (token: string) => {
        let index = database.items.findIndex(item => item.key == 'token');
        if (index == -1) database.items.push({ key: 'token', value: token });
        else database.items[index].value = token;
        database.save();
    }
});

rayconnect.auth.event(() => {
    rayconnect.storage.from(Apps);
});

export { Rayconnect, rayconnect };