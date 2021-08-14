import { FileSystem, zipOf, upload } from '../../lib/core';
import { IDeployOptions } from "../interface/deploy";
import CliProgress from 'cli-progress';
import chalk from 'chalk';


export async function deploy(options: IDeployOptions) {
    let fileSystem = new FileSystem();
    let zip = await zipOf(options.input);
    try {
        let input = fileSystem.readStream(zip);

        let progress = new CliProgress.SingleBar({
            format: 'Deploying |' + chalk.cyan('{bar}') + '| {percentage}%',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
        }, CliProgress.Presets.shades_classic);

        await upload({
            input: input,
            domain: options.domain,
            token: options.token,
            onStart: (total: number) => {
                progress.start(total, 0);
            },
            onProgress: (transferred: number) => {
                progress.update(transferred);
            },
            onEnd: () => {
                progress.stop();
                fileSystem.delete(zip);
            }
        });
    } catch (error) {
        await fileSystem.delete(zip);
        return Promise.reject(error);
    }
}