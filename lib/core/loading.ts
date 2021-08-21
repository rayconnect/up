import logUpdate from 'log-update';
import spinners from 'cli-spinners';
import chalk from 'chalk';

export class Loading {
    private interval: any;
    private i: number = 0;

    constructor(public message: string) {
        this.start();
    }

    public start() {
        let spinner = spinners.dots, { frames } = spinner;
        this.interval = setInterval(() => {
            logUpdate(chalk.green(frames[this.i = ++this.i % frames.length]) + ` ${this.message}`);
        }, spinner.interval);
    }

    public stop() {
        clearInterval(this.interval);
    }
}
