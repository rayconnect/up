import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync, createWriteStream, WriteStream, ReadStream, createReadStream } from "fs";
import { homedir } from "os";
import { join } from "path";

export class FileSystem {
    public path: string = join(homedir(), '.rayconnect-workspace');

    constructor() {
        this.mkdir();
    }

    public from(name: string): string {
        return join(this.path, name);
    }

    public exist(name: string): boolean {
        return existsSync(this.from(name));
    }

    public write(file: string, data: string): void {
        writeFileSync(this.from(file), data);
    }

    public writeStream(file: string): WriteStream {
        return createWriteStream(this.from(file));
    }

    @CheckExist()
    public delete(name: string): void {
        unlinkSync(name);
    }

    @CheckExist()
    public read(file: string): string | null {
        return readFileSync(file).toString();
    }

    @CheckExist()
    public readStream(file: string): ReadStream {
        return createReadStream(file);
    }

    @CheckExist({
        was: false
    })
    public mkdir(folder: string = ''): void {
        mkdirSync(folder);
    }
}

function CheckExist(option: { was: boolean } = { was: true }) {
    return (target: FileSystem, key: string, descriptor: PropertyDescriptor) => {
        let VALUE = descriptor.value!;

        descriptor.value = (...args: any[]) => {
            let name = args[0] || '', path = join(homedir(), '.rayconnect-workspace', name);
            args[0] = path;
            if (existsSync(path) == option.was)
                return VALUE.apply(target, args);
            else
                return null;
        }

        return descriptor;
    }
}