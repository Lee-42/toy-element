import type { App, Plugin } from "vue"
import { each } from "lodash-es"

// SFCWithInstall 既可以是组件, 也可以是插件
type SFCWithInstall<T> = T & Plugin;

export function makeInstaller(components: Plugin[]) {
    const installer = (app: App) => each(components, (c) => app.use(c))
    return installer
}

export const withInstall = <T>(component: T) => {
    (component as SFCWithInstall<T>).install = (app: App) => {
        const name = (component as any).name
        app.component(name, component as Plugin)
    }

    return component as SFCWithInstall<T>
}

export const withInstallFunction = <T>(fn: T, name: string) => {
    (fn as SFCWithInstall<T>).install = (app: App) => {
        app.config.globalProperties[name] = fn;
    };
    return fn as SFCWithInstall<T>;
};

