import chalk from 'chalk';
import commander from 'commander';
import { ICommandOption } from '../interface/cli';

type CommandLines = new (...args: any[]) => ofCommandLine;

export class CLI {
    private program: commander.Command = new commander.Command();

    constructor(...commands: CommandLines[]) {
        for (let command of commands) {
            let item: ofCommandLine = new command();
            let options: ICommandOption = (item as any)['OPTIONS'];
            let run = (item as any)['run'];
            if (run) {
                let cmd = this.program.command(options.name);
                if (options.args) {
                    for (let arg of options.args) cmd.option(arg, '');
                }
                cmd.description(options.description);
                cmd.action(async (...args: any[]) => {
                    await run.bind(item, args[0]).apply();
                });
            }
        }

        this.program.parse(process.argv);
    }
}

export class ofCommandLine {
    protected line(): void {
        console.log('');
    }

    protected exit(): void {
        process.exit(0);
    }

    needAuth(): void {
        console.log(chalk.red('You must login via [rayconnect-up login]'));
        this.exit();
    }
}

export function Command(options: ICommandOption) {
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        return class Command extends constructor {
            OPTIONS: ICommandOption = options;
        }
    }
}