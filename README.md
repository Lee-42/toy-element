# toy-element

#### 一、创建项目

1、新建.gitignore
2、新建 packages 目录存放包
3、创建 pnpm 工作空间 pnpm-workspace.yaml

```yaml
packages:
  - "packages/*"
```

4、使用 pnpm 来初始化

```shell
pnpm init
```

5、进入 packages, 创建相关目录

```shell
mkdir components core docs hooks theme utils
```

6、为每个子包进行 pnpm init, 编写 init.shell

```shell
for i in components core docs hooks theme utils; do
    cd $i
    pnpm init
    cd ..
done
```

运行 ./init.shell
7、创建 playground, 在 packages 目录下

```shell
pnpm create vite play --template vue-ts
```

是一个简单的 vue 项目, 平常写一些简单的组件用来看效果的
8、介绍目录功能

- components:所有的组件都在这里开发
- core: npm 包的入口
- docs: 项目文档
- hooks: 一些自定义钩子
- theme: 样式
- utils: 工具函数

9、修改子包的名称
除了 core 叫 "toy-element", 其他都叫 "@toy-element/components"、"@toy-element/docs"。。。。
这样起名可以尽量避免重名, 避免与其他的开源重名

10、安装依赖

```shell
pnpm add -Dw typescript@^5.2.2 vite@^5.1.4 vitest@^1.4.0 vue-tsc@^1.8.27 postcss-color-mix@^1.1.0 postcss-each@^1.1.0 postcss-each-variables@^0.3.0 postcss-for@^2.1.1 postcss-nested@^6.0.1 @types/node@^20.11.20 @types/lodash-es@^4.17.12 @vitejs/plugin-vue@^5.0.4 @vitejs/plugin-vue-jsx@^3.1.0 @vue/tsconfig@^0.5.1

pnpm add -w lodash-es@^4.17.21 vue@^3.4.19
```

11、在根 package.json 添加子包的依赖

```json
"dependencies": {
  "lodash-es": "^4.17.21",
  "vue": "^3.4.19",
  "toy-element": "workspace:*",
  "@toy-element/components": "workspace:*",
  "@toy-element/hooks": "workspace:*",
  "@toy-element/utils": "workspace:*",
  "@toy-element/theme": "workspace:*"
}
```

12、安装子包的依赖

```shell
# components
pnpm add -D @vue/test-utils@^2.4.5 @vitest/coverage-v8@^1.4.0 jsdom@^24.0.0 --filter @toy-element/components
pnpm add @popperjs/core@^2.11.8 async-validator@^4.2.5 --filter @toy-element/components
# docs
pnpm add -D vitepress@1.0.0-rc.44 --filter @toy-element/docs
```

- core core 可以看做是 components 唯一出口, 所以把 components 链接下来就可以了

```json
"dependencies": {
    "@toy-element/components": "workspace:*"
  }
```

13、裁剪 play
去掉 package.json 的 vue、typescript、vite、vue-tsc 依赖

```json
{
  "name": "play",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.4"
  }
}
```

去掉 tsconfig.json、tsconfig.app.json
然后生成全局的 tsconfig.json、tsconfig.node.json

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "jsxImportSource": "vue",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["packages/**/*.ts", "packages/**/*.tsx", "packages/**/*.vue"]
}
```

```json
{
  "extends": "@tsconfig/node18/tsconfig.json",
  "include": ["packages/**/**.config.ts"],
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "types": ["node"]
  }
}
```

14、生成 postcss 配置

```js
/* eslint-env node */
module.exports = {
  plugins: [
    require("postcss-nested"),
    require("postcss-each-variables"),
    require("postcss-each")({
      plugins: {
        beforeEach: [require("postcss-for"), require("postcss-color-mix")],
      },
    }),
  ],
};
```

15、在创建所有分包的入口之前, 在根目录跑 pnpm install

#### 二、编写工具方法

1、utils 新建 install.ts, 负责所有 vue 插件的安装

```typescript
import type { App, Plugin } from "vue";
import { each } from "lodash-es";

// SFCWithInstall 既可以是组件, 也可以是插件
type SFCWithInstall<T> = T & Plugin;

export function makeInstaller(components: Plugin[]): Plugin {
  const installer = (app: App) => each(components, (c) => app.use(c));
  return installer as Plugin;
}

export const withInstall = <T>(component: T) => {
  (component as SFCWithInstall<T>).install = (app: App) => {
    const name = (component as any).name;
    app.component(name, component as Plugin);
  };
};
```

#### 三、创建 Button 组件

1、创建 Button 文件夹, 每个组件的目录都类似下面这样

- index.ts
- Button.vue
- Button.test.tsx
- types.ts
- style.css
- constants.ts

2、简单测试一下
Button.vue

```vue
<template>
  <button style="color: red">test button</button>
</template>
```

index.ts

```typescript
import Button from "./Button.vue";
import { withInstall } from "@toy-element/utils";

export const ErButton = withInstall(Button);
```

components/index.ts。负责导出组件

```typescript
export * from "./Button";
```

core/components.ts。 负责引入

```typescript
import { ErButton } from "@toy-element/components";
import type { Plugin } from "vue";

export default [ErButton] as unknown as Plugin[];
```

core/index.ts。 core 的入口文件

```typescript
import { makeInstaller } from "@toy-element/utils";
import components from "./components";

const installer = makeInstaller(components);

// 使用者在使用我们的包的时候, 可以以一个vue的plugin来使用, 用app.use() 来挂载到实例上面
export * from "@toy-element/components";
export default installer;
```

#### 四、在 playground 里面试一下

1、
