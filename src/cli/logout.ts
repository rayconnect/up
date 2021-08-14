import chalk from "chalk";
import prompts from "prompts";
// Command line
import { Command, FileSystem, ofCommandLine } from "../../lib/core";
import { CommandLine } from "../../lib/interface";

@Command({
    name: 'logout',
    description: 'Log out of your account'
})
export class Logout extends ofCommandLine implements CommandLine {
    async run(): Promise<void> {
        let res = await prompts({
            name: 'confirm',
            type: 'confirm',
            message: 'Would you like to log out of your account?',
        });

        if (res.confirm) {
            let fs = new FileSystem();
            await fs.delete('rayconnect.json');
            console.log(chalk.green('You are happily logged out of your account!'));
        } else {
            console.log('I\'m glad you did not want to leave your account and stay with us!');
        }
        this.exit();
    }
}