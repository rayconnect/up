export interface ICommandOption {
    name: string
    args?: string[]
    description: string
}

export interface IArg {
    [key: string]: boolean | string | number
}

export interface CommandLine {
    run(args?: IArg): void | Promise<void>
}