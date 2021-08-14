import chalk from "chalk";
import figlet from "figlet";
import prompts from "prompts";
import data from '../../package.json';
// Command line
import { CommandLine, IArg } from "../../lib/interface";
import { Command, ofCommandLine } from "../../lib/core";

let row: number = 30;

let items: { key: string, value: string }[] = [
    {
        'key': 'Package name',
        'value': data.name,
    },
    {
        'key': 'Package version',
        'value': data.version
    },
    {
        'key': 'Package license',
        'value': data.license
    },
    {
        'key': 'Package auther',
        'value': `${data.author.name} <${data.author.email}>`,
    },
    {
        'key': 'NodeJS version',
        'value': process.versions.node
    },
    {
        'key': 'Client version',
        'value': data.dependencies["rayconnect-client"].replace('^', '')
    }
];

let eggs: string[] = [
    'You are beautifully clean code beauty!',
    'I loved backend, but you loved Rayconnect!',
    'You are my lovely programmer!',
    'I know you from choosing Rayconnect!',
    'I sleep at night with your strange codes!',
    'You like to know the version very much!',
    'Do you like me more or the door and the wall?',
    'Drink water and go to the bathroom!',
    'Do not be afraid, but there is a bug behind you!',
    'It lingers when we\'re done             you\'ll believe God is a woman',
    '01101000 01100101 01101100 01101100 01101111 00100000 01101101 01111001 00100000 01100110 01110010 01101001 01100101 01101110 01100100',
    'We are out of Eggs!'
];

function logo(): Promise<void> {
    return new Promise((resolve) => {
        figlet('Rayconnect UP', (_, text) => {
            console.log(text);
            resolve();
        });
    });
}

function write(key: string, value: string): Promise<void> {
    return new Promise((resolve) => {
        key = chalk.blue(key + ': ');
        value = chalk.white(value);
        let space = '';
        for (let i = 0; i < row - key.length; i++) space += ' ';
        console.log(`${key}${space}${value}`);
        resolve();
    });
}

function writeEasterEgg(all: boolean = false) {
    if (all == false) {
        let egg: string = eggs[Math.floor(Math.random() * eggs.length)];
        if (egg)
            console.log(chalk.red(egg));
    } else {
        eggs.forEach(egg => console.log(chalk.red(egg)));
    }
}

@Command({
    name: 'version',
    args: ['--all-eggs'],
    description: 'You\'ll know about CLI version and packages'
})
export class About extends ofCommandLine implements CommandLine {

    async run(args: IArg): Promise<void> {        
        let showAllEggs: boolean = args && args['allEggs'] ? args['allEggs'] as boolean : false;
        if (showAllEggs) {
            let res = await prompts({
                name: 'confirm',
                type: 'confirm',
                message: 'Do you really want to break all the eggs?'
            });

            await this.doRun(res.confirm);
        }
        else await this.doRun(false);
    }

    async doRun(showAllEggs: boolean): Promise<void> {        
        this.line();
        await logo();        
        this.line();
        for (let item of items) await write(item.key, item.value);
        this.line();
        writeEasterEgg(showAllEggs);
        this.exit();
    }
}