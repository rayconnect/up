import { ReadStream } from "fs";

export interface IUploadOptions {
    input: ReadStream
    domain: string
    token: string
    onStart: (total: number) => void
    onProgress: (transferred: number) => void
    onEnd: () => void
}