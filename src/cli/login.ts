import chalk from "chalk";
import figlet from "figlet";
import prompts from "prompts";
// Command line
import { Command, ofCommandLine } from "../../lib/core";
import { CommandLine } from "../../lib/interface";
// Rayconnect
import { rayconnect } from "../core/rayconnect";

@Command({
    name: 'login',
    description: 'Login to your account',
})
export class Login extends ofCommandLine implements CommandLine {
    private phone: string | undefined;

    async run(): Promise<void> {
        this.line();
        await this.logo();
        this.line();
        await this.send();
        await this.verify();
    }

    async send(): Promise<void> {
        let res = await prompts({
            name: 'phone',
            type: 'text',
            message: 'Enter your phone number:',
            validate: value => value.length == 11
        }, {
            onCancel: () => this.cancel()
        });

        await rayconnect.auth.send(res.phone);
        this.phone = res.phone;
    }

    async verify(): Promise<void> {
        await prompts({
            name: 'code',
            type: 'text',
            message: `Enter sent code to ${this.phone}:`,
            validate: async (value) => {
                if (value.length == 4) {
                    try {
                        return await rayconnect.auth.verify(this.phone as string, value);
                    } catch (error) {
                        return false;
                    }
                } else return false;
            }
        }, {
            onCancel: () => this.cancel()
        });

        console.log(chalk.green(`You logged in as ${this.phone} successfully !`));
        this.exit();
    }

    logo(): Promise<void> {
        return new Promise((resolve) => {
            figlet('Rayconnect UP', (_, text) => {
                console.log(text);
                resolve();
            });
        });
    }

    cancel(): void {
        console.log(chalk.red('Login to account cancelled by you!'));
        this.exit();
    }
}