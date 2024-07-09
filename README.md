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

1、main.ts

```typescript
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import ToyElement from "toy-element";

const app = createApp(App);
app.use(ToyElement);
app.mount("#app");
```

#### 五、样式初始化

1、theme/index.css、theme/reset.css
2、在 core 里面引入一下
core/index.ts

```js
import "@toy-element/theme/index.css";
```

#### 六、初始化文档

1、切到 docs, 初始化一下 vitepress

```shell
npx vitepress init
Where should VitePress initialize the config?
# ◇  Site title:
# │  Toy-Element
# ◇  Site description:
# │  高仿 ElementPlus 组件库
# ◇  Theme:
# │  Default Theme
# ◇  Use TypeScript for config and theme files?
# │  Yes
# ◇  Add VitePress npm scripts to package.json?
# │  Yes
# └  Done! Now run npm run docs:dev and start writing.
```

运行

```shell
npm run docs:dev
```

在根目录 package.json 添加脚本

```json
"scripts": {
    "docs:dev": "pnpm --filter @toy-element/docs dev",
    "docs:build": "pnpm --filter @toy-element/docs build"
  },
```

2、修改 vitepress 配置
config.mts

```ts
base: "/toy-element/",
```

3、创建 github actions
新建.github/workflows/test-and-deploy.yaml

```yaml
name: Test and deploy

on:
  push:
    branches:
      - master

jobs:
  test:
    name: Run Lint and Test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run tests
        run: npm run test

  build:
    name: Build docs
    runs-on: ubuntu-latest
    needs: test

    steps:
      - name: Checkout repo
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build docs
        run: npm run docs:build

      - name: Upload docs
        uses: actions/upload-artifact@v3
        with:
          name: docs
          path: ./packages/docs/.vitepress/dist

  deploy:
    name: Deploy to GitHub Pages
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Download docs
        uses: actions/download-artifact@v3
        with:
          name: docs

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: s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
          publish_dir: .
```

如果在 master 分支下进行 push 操作, 就执行以下 jobs。
每 push 一次, github 就会根据这个文件执行 ations, 执行成功后就可以生成访问这个网页的路径

#### 七、项目打包

1、项目支持 esm 和 umd 格式
2、先写 umd 格式。core 新建 vite.umd.config.ts

```typescript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: "dist/umd",
    lib: {
      entry: resolve(__dirname, "./index.ts"),
      name: "ToyElement",
      fileName: "index",
      formats: ["umd"],
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "index.css";
          return assetInfo.name as string;
        },
      },
    },
  },
});
```

core/pakage.json 写脚本

```json
"scripts": {
    "build-umd": "vite build --config vite.umd.config.ts"
}
```

试着打包。
3、其实 umd 生成的文件应该是 cjs。 esm 生成的文件才是 js
通过修改 core/package.json 的 type 字段为 "module"

```json
"type": "module"
```

4、写 esm 格式的包, 新建 vite.es.config.ts

```typescript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: "dist/es",
    lib: {
      entry: resolve(__dirname, "./index.ts"),
      name: "ToyElement",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "vue", // es 格式的要进行分包, 除了要安装vue之外, 还要安装图标
        "@fortawesome/fontawesome-svg-core",
        "@fortawesome/free-solid-svg-icons",
        "@fortawesome/vue-fontawesome",
        "@popperjs/core",
        "async-validator",
      ],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "index.css";
          return assetInfo.name as string;
        },
      },
    },
  },
});
```

5、还有一个问题，其他开发者在引用我们这个包的时候没有类型提示，所以我们需要安装一个 vite 的插件。
在 core 子包下安装

```shell
pnpm add vite-plugin-dts@^3.9.1 -D
```

```typescript
import dts from "vite-plugin-dts";
```

再次运行就会生成类型文件了

6、但是生成的包的格式和我们预期的不一致, 我们希望 dist 目录下生成有一个 es、umd、还有一个专门存放样式的文件夹。
根目录新建 tsconfig.build.json, 内容和根目录的 tsconfig.json 一样, 只是 includes 要改一下

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
  "include": [
    "packages/core/index.ts",
    "packages/hooks/**/*.ts",
    "packages/utils/**/*.ts",
    "packages/components/index.ts",
    "packages/components/**/*.ts",
    "packages/components/**/*.vue"
  ]
}
```

接着在 dts()插件配置这个 json 文件的路径

```js
dts({
  tsconfigPath: "../../tsconfig.build.json",
  outDir: "dist/types",
});
```

再运行一次, 生成的机构就符合预期了

7、分包
修改 vite.umd.config.ts, 针对 node_modules、hooks、utils 进行分包。对每个组件进行分包(用一个数组表示)

```js
// 分包
manualChunks(id) {
    // id是路径
    if (id.includes("node_modules")) {
        return "vendor"
    }
    if (id.includes("/packages/hooks")) {
        return "hooks"
    }
    if (id.includes("/packages/utils")) {
        return "utils"
    }
    for (const item in COMP_NAMES) {
        if (id.includes(`/packages/components/${item}`)) {
            return item
        }
    }
}
```

8、将 index.css 移到 dist 里面。 根目录安装 move-file-cli。 不写 shell 脚本, 为了各大平台的兼容性

```shell
pnpm add move-file-cli@^3.0.0 -Dw
```

添加脚本

```json
"move-style": "move-file dist/es/index.css dist/index.css"
```

9、 串联脚本。 安装 npm-run-all

```shell
pnpm install npm-run-all@^4.1.5 -Dw
```

添加运行脚本

```json
"build": "run-s build-only move-style",
"build-only": "run-p build-es build-umd",
```

根目录 package.json 添加脚本

```js
"build": "pnpm --filter toy-element build"
```

10、修改 core/package.json, 增加描述、修改 main

```json
{
  "description": "Components library by Vue3 + ts",
  "type": "module",
  "main": "./dist/umd/index.umd.cjs",
  "module": "./dist/es/index.js",
  "types": "./dist/types/core/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/es/index.js",
      "require": "./dist/umd/index.umd.cjs",
      "types": "./dist/types/core/index.d.ts"
    },
    "./dist/": {
      // 如果不定义这个, 样式文件就识别不了
      "import": "./dist/",
      "require": "./dist/"
    }
  },
  "sideEffects": ["./dist/index.css"],
  "dependencies": {
    "@fortawesome/fontawesome-svg-core": "^6.5.1",
    "@fortawesome/free-solid-svg-icons": "^6.5.1",
    "@fortawesome/vue-fontawesome": "^3.0.6",
    "@popperjs/core": "^2.11.8",
    "async-validator": "^4.2.5"
  },
  "devDependencies": {
    "vite-plugin-dts": "^3.9.1",
    "@toy-element/components": "workspace:*"
  },
  "peerDependencies": {
    // 用户的vue需要和我们的版本一致, 不然会给一个npm的提示
    "vue": "^3.4.19"
  }
}
```

将 componets 的依赖移到根目录 package.json 下

#### 八、Button 组件的开发

1、要统一开源库的版本, 根源一定要统一 nodejs 的版本
新建.nvmrc

```txt
v18.17.0
```

在 Unix 系统直接 nvm use 就可以切换版本

```shell
nvm use
```

在 window 系统需要

```shell
nvm use $(cat .nvmrc)
```
