import { ILog, IOptions } from "../interface/log";
import { Database } from "./database";

const defaults: IOptions = {
    'type': 'log'
};

const database: Database<ILog> = new Database<ILog>({ name: 'logs', preload: false });

export function log(data: string, options: IOptions = defaults): void {
    if (!options) options = defaults;
    if (!options.type) options.type = 'log';

    let item: ILog = {
        id: Date.now(),
        at: new Date().toString(),
        type: options.type,
        data: data
    }

    database.load();

    database.items.push(item);

    database.save();

    database.unload();
}