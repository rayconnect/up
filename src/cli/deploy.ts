import prompts, { Choice } from "prompts";
import chalk from "chalk";
import { deploy } from "../function/deploy";
// Command line
import { Command, ofCommandLine } from "../../lib/core";
import { CommandLine } from "../../lib/interface";
// Rayconnect
import { rayconnect } from "../core/rayconnect";
// Storage
import { Apps as AppsStorage } from "../core/apps";
import { App } from "../interface/apps";

@Command({
    name: 'deploy',
    description: 'Deploy your rayconnect app'
})
export class Deploy extends ofCommandLine implements CommandLine {
    async run(): Promise<void> {
        let status = await rayconnect.auth.init();
        if (status == false) this.needAuth();
        else {
            let apps: AppsStorage = rayconnect.storage.get('apps');
            await apps.load();
            if (apps.items.length == 0) {
                console.log(chalk.red('You haven\'t add any apps, yet!'));
                console.log(chalk.white('Try add new one with [rayconnect-up app --add]'));
                this.exit();
            }
            else {
                let item = await this.select(apps.items);
                if (item) {
                    this.confirm(async () => {
                        let path: string = process.env.PWD as string;
                        try {
                            console.log(chalk.blue('Please hold your hands tightly and pray to God that there is no problem!'));
                            this.line();
                            await deploy({
                                input: path,
                                domain: item?.domain || '',
                                token: item?.token || '',
                            });
                            this.line();
                            console.log(chalk.green(`Put your hands on the keyboard and checkout https://${item?.domain} for your new chenges!`));
                            this.exit();
                        } catch (error) {
                            console.log(chalk.red('Please keep calm because i think we could not continue to deploy your app because of an unexpected error!'));
                            this.exit();
                        }
                    })
                } else {
                    console.log(chalk.red('I think you forgot to choose an app!'));
                    this.exit();
                }
            }
        }
    }

    async select(items: App[]): Promise<App | null> {
        let choises: Choice[] = items.map(item => {
            return {
                title: item.domain,
                value: item
            }
        });

        let res = await prompts({
            name: 'item',
            type: 'select',
            choices: choises,
            message: 'Select an app:'
        }, {
            onCancel: () => {
                console.log(chalk.red('Okey, we don\'t say why don\'t deploy!'));
                this.exit();
            }
        });

        return res.item as App;
    }

    async confirm(callback: Function): Promise<void> {
        let res = await prompts({
            name: 'confirm',
            type: 'confirm',
            message: 'Are you sure of the choice you made and you will not need God later?',
        });

        if (res.confirm) callback();
        else {
            console.log('Like you weren\'t sure!');
            this.exit();
        }
    }
}