import { IDatabaseOption } from "../interface/database";
import { FileSystem } from "./fs";

export class Database<T> {
    private fs: FileSystem = new FileSystem();

    public items: T[] = [];

    constructor(private options: IDatabaseOption) {
        this.options.name = `${this.options.name}.json`;
        this.options.preload = this.options.preload == null ? true : this.options.preload;

        if (this.fs.exist(this.options.name) == false) this.save();
        else if (this.options.preload) this.load();
    }

    public load(): Database<T> {
        let data: string | null = this.fs.read(this.options.name);
        if (data) {
            try {
                this.items = JSON.parse(data);
            } catch (error) {
                this.items = [];
            }
        }
        return this;
    }

    public save(): void {
        this.fs.write(this.options.name, JSON.stringify(this.items));
    }

    public unload(): void {
        this.items = [];
    }
}