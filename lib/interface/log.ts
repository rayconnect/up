export type types = 'log' | 'error' | 'warning';

export interface ILog {
    id: number
    at: string
    type: types
    data: any
}

export interface IOptions {
    type: types,
}
