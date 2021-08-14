export interface KeyValue {
    key: string
    value: any
}

export interface IDatabaseOption {
    name: string
    preload?: boolean
}

export interface KeyValueWithId extends KeyValue {
    id: string
}