import prompts from "prompts";
import chalk from "chalk";
import { printTable } from 'console-table-printer';
// Command line
import { Command, ofCommandLine } from "../../lib/core";
import { CommandLine, IArg } from "../../lib/interface";
// Rayconnect
import { rayconnect } from "../core/rayconnect";
import { Rayconnect } from "@iamnonroot/rayconnect-client";
// Storage
import { Apps as AppsStorage } from "../core/apps";
import { App } from "../interface/apps";

@Command({
    name: 'app',
    args: ['--list', '--add'],
    description: 'Your all apps.'
})
export class Apps extends ofCommandLine implements CommandLine {
    async run(args: IArg): Promise<void> {
        if (Object.keys(args).length == 0) this.showArgs();
        else {
            let status = await rayconnect.auth.init();
            if (status == false) this.needAuth();
            else {
                let apps: AppsStorage = rayconnect.storage.get('apps');
                await apps.load();                
                if (args['list'] && args['list'] == true) await this.list(apps.items);
                if (args['add'] && args['add'] == true) await this.add();
            }
        }
    }

    showArgs(): void {
        console.log('rayconnect-up app --list');
        console.log('rayconnect-up app --add');
        this.exit();
    }

    needAuth(): void {
        console.log(chalk.red('You must login via [rayconnect-up login]'));
        this.exit();
    }

    async list(items: App[]): Promise<void> {
        if (items.length == 0) {
            console.log(chalk.red('You haven\'t add any apps, yet!'));
            console.log(chalk.white('Try add new one with [rayconnect-up app --add]'));
        }
        else
            await printTable(items.map((item, index) => {
                return {
                    index: index + 1,
                    aid: item.aid,
                    domain: item.domain
                }
            }));
        this.exit();
    }

    async add(): Promise<void> {
        let res = await prompts([
            {
                name: 'aid',
                type: 'text',
                message: 'App ID:'
            },
            {
                name: 'domain',
                type: 'text',
                message: 'Domain:'
            },
            {
                name: 'username',
                type: 'text',
                message: 'System admin username:'
            },
            {
                name: 'password',
                type: 'password',
                message: 'System admin password:'
            }
        ]);

        let rayconnectForApp = new Rayconnect({
            aid: res.aid,
            scopes: []
        });

        rayconnectForApp.auth.setCallback({
            setToken: async (token: string) => {
                await rayconnect.storage.get<AppsStorage>('apps').add({
                    'aid': res.aid,
                    'domain': res.domain,
                    'token': token
                });

                console.log(chalk.green(`A new app that id is ${res.aid} and domain name is ${res.domain}, added successfully!`));
                this.exit();
            }
        });

        let status: boolean = await rayconnectForApp.auth.with({ username: res.username, password: res.password });
        if (status == false) {
            console.log(chalk.red('You have entered wrong username/password!'));
            this.exit();
        }

    }
}