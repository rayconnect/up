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
import { Loading } from "../../lib/core/loading";

@Command({
    name: 'app',
    args: ['--list', '--add'],
    description: 'Your all apps.'
})
export class Apps extends ofCommandLine implements CommandLine {
    async run(args: IArg): Promise<void> {
        if (Object.keys(args).length == 0) this.showArgs();
        else {
            let loading = new Loading('Logging in to your account ...');
            await rayconnect.client.connected();
            let status = await rayconnect.auth.init();
            if (status == false) {
                loading.stop();
                this.needAuth();
            }
            else {
                loading.message = 'Fetching your apps ...';
                let apps: AppsStorage = rayconnect.storage.get('apps');
                await apps.load();
                loading.stop();
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
                message: 'Domain:',
                hint: 'Without HTTP/HTTPS'
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
        ], {
            onCancel: () => {
                console.log(chalk.red('You canceled or what ?'));
                this.exit();
            }
        });

        let loading = new Loading('Connecting to rayconnect ...');
        
        try {
            let rayconnectForApp = new Rayconnect({
                aid: res.aid,
                scopes: ['_no_'],
            });
            
            await rayconnectForApp.client.connected();
            
            loading.message = 'Authenticating ...';
            
            rayconnectForApp.auth.setCallback({
                setToken: async (token: string) => {
                    loading.stop();
                    try {
                        await rayconnect.storage.get<AppsStorage>('apps').add({
                            'aid': res.aid,
                            'domain': res.domain,
                            'token': token
                        });
                        loading.stop();
                        console.log(chalk.green(`A new app that id is ${res.aid} and domain name is ${res.domain}, added successfully!`));
                        this.exit();

                    } catch (error) {                        
                        loading.stop();
                        console.log(chalk.red('Save faild!'));
                        this.exit();
                    }

                }
            });


            let status: boolean = await rayconnectForApp.auth.with({ username: res.username, password: res.password });

            loading.message = 'Saving ...';

            if (status == false) {
                loading.stop();
                console.log(chalk.red('You have entered wrong username/password!'));
                this.exit();
            }
        } catch (error) {
            loading.stop();
            console.log(chalk.red('Error on login with this app!'));
            this.exit();
        }
    }
}