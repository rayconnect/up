import got from 'got';
import FormData from 'form-data';
import { IUploadOptions } from '../interface/upload';

export async function upload(options: IUploadOptions) {
    let form = new FormData(), total = 0;

    form.append('file', options.input);


    await got.post(`https://${options.domain}/api/v2/static/spa/upload?token=${options.token}`, {
        body: form
    })
        .on('uploadProgress', progress => {
            if (total != progress.total) {
                total = progress.total as number;
                options.onStart(total);
            }

            options.onProgress(progress.transferred);
        });

    options.onEnd();
}