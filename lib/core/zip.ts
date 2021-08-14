import archiver from "archiver";
import { existsSync } from "fs";
import { v4 } from "uuid";
import { FileSystem } from "./fs";


const fs: FileSystem = new FileSystem();

export function zipOf(input: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (existsSync(input) == false) return reject({ 'from': 'exist', error: `${input} as input folder is not exists` });
        const
            name: string = `${v4()}.zip`,
            stream = fs.writeStream(name),
            archive = archiver('zip');

        stream.on('close', () => {
            resolve(name);
        });

        stream.on('error', (error) => {
            reject({ 'from': 'stream', error });
        });

        archive.on('error', (error) => {
            reject({ 'from': 'archive', error });
        });

        archive.pipe(stream);
        archive.directory(input, false).finalize();
    });
}