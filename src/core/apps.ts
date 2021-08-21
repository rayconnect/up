import { LoadAndSaveStorage, Storage } from "@iamnonroot/rayconnect-client/core";
import { App } from "../interface/apps";

@Storage({
    name: 'apps'
})
export class Apps extends LoadAndSaveStorage<App> {
    public async add(app: App): Promise<void> {
        try {            
            let index = this.items.findIndex((item) => item.domain == app.domain);
            if (index == -1) {
                this.items.push(app);                
                await this.save();
            }
        } catch (error) {
            return Promise.reject(error)
        }
    }

    public async removeByDomain(domain: string): Promise<void> {
        let index = this.items.findIndex((item) => item.domain == domain);
        if (index != -1) {
            this.items.splice(index, 1);
            await this.save();
        }
    }

    public getByDomain(domain: string): App | undefined {
        return this.items.find(item => item.domain == domain);
    }

    public getAllByAppId(aid: string): App[] {
        return this.items.filter(item => item.aid == aid);
    }
}