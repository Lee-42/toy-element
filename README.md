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

#### 八、nvm 版本限定

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

#### 九、大模型

1、项目的所有需求分析、测试用例都是用大模型来做辅助的
2、大模型推荐
ChatGPT
Poe
Chandler
Kimi

3、需求分析 提示词

- 身份定位: 角色-互联网产品经理、目标-产品需求分析和功能点设计
- 前提条件:
- 输出限定

#### 十、Button 组件的开发

0、TDD 的魅力

1、新建 vitest.config.ts

```typescript
/// <reference types="vitest" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  plugins: [vue(), vueJsx()],
  test: {
    globals: true,
    environment: "jsdom",
  },
});
```

2、修改修改 test 脚本

```json
"test": "vitest --coverage"
```

3、新建 Button.test.tsx 测试用例

```typescript
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import Button from "./Button.vue";

describe("Button.vue", () => {
  // Props: type
  it("should has the correct type class when type prop is set", () => {
    const types = ["primary", "success", "warning", "danger", "info"];
    types.forEach((type) => {
      const wrapper = mount(Button, {
        props: { type: type as any },
      });
      expect(wrapper.classes()).toContain(`er-button--${type}`);
    });
  });

  // Props: size
  it("should has the correct size class when size prop is set", () => {
    const sizes = ["large", "default", "small"];
    sizes.forEach((size) => {
      const wrapper = mount(Button, {
        props: { size: size as any },
      });
      expect(wrapper.classes()).toContain(`er-button--${size}`);
    });
  });

  // Props: plain, round, circle
  it.each([
    ["plain", "is-plain"],
    ["round", "is-round"],
    ["circle", "is-circle"],
    ["disabled", "is-disabled"],
    ["loading", "is-loading"],
  ])(
    "should has the correct class when prop %s is set to true",
    (prop, className) => {
      const wrapper = mount(Button, {
        props: { [prop]: true },
        global: {
          stubs: ["ErIcon"],
        },
      });
      expect(wrapper.classes()).toContain(className);
    }
  );

  it("should has the correct native type attribute when native-type prop is set", () => {
    const wrapper = mount(Button, {
      props: { nativeType: "submit" },
    });
    expect(wrapper.element.tagName).toBe("BUTTON");
    expect((wrapper.element as any).type).toBe("submit");
  });

  // Props: tag
  it("should renders the custom tag when tag prop is set", () => {
    const wrapper = mount(Button, {
      props: { tag: "a" },
    });
    expect(wrapper.element.tagName.toLowerCase()).toBe("a");
  });

  // Events: click
  it("should emits a click event when the button is clicked", async () => {
    const wrapper = mount(Button, {});
    await wrapper.trigger("click");
    expect(wrapper.emitted().click).toHaveLength(1);
  });
});
```

4、编写类型文件

```typescript
import type { Component, Ref } from "vue";

export type ButtonType = "primary" | "sucess" | "warning" | "danger" | "info";
export type NativeType = "button" | "reset" | "submit";
export type ButtonSize = "large" | "default" | "small";

export interface ButtonProps {
  tag?: string | Component;
  type?: string;
  size?: ButtonSize;
  nativeType?: NativeType;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  circle?: boolean;
  plain?: boolean;
  round?: boolean;
  autofocus?: boolean;
  useThrottle?: boolean;
  throttleDuration?: number;
  loadingIcon?: string;
}

export interface ButtonEmits {
  (e: "click", vol: MouseEvent): void;
}

export interface ButtonInstance {
  ref: Ref<HTMLButtonElement | void>;
}
```

```vue
<template>
  <component
    :is="props.tag"
    :ref="_ref"
    :type="tag === 'button' ? nativeType : void 0"
    :disabled="disabled || loading ? true : void 0"
    class="er-button"
    :class="{
      [`er-button--${type}`]: type,
      [`er-button--${size}`]: size,
      'is-plain': plain,
      'is-round': round,
      'is-circle': circle,
      'is-disabled': disabled,
      'is-loading': loading,
    }"
  >
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import type { ButtonProps } from "./types";
import { ref } from "vue";

defineOptions({
  name: "ErButton",
});
const props = withDefaults(defineProps<ButtonProps>(), {
  tag: "button",
  nativeType: "button",
});

const slot = defineSlots();

const _ref = ref<HTMLButtonElement>();
</script>
```

5、全局样式

```css
/* 全局的css变量, 方便做主题切换 */
:root {
  /* colors */
  --er-color-white: #ffffff;
  --er-color-black: #000000;
  --colors: (
    primary: #409eff,
    success: #67c23a,
    warning: #e6a23c,
    danger: #f56c6c,
    info: #909399
  );
  --er-bg-color: #ffffff;
  --er-bg-color-page: #f2f3f5;
  --er-bg-color-overlay: #ffffff;
  --er-text-color-primary: #303133;
  --er-text-color-regular: #606266;
  --er-text-color-secondary: #909399;
  --er-text-color-placeholder: #a8abb2;
  --er-text-color-disabled: #c0c4cc;
  --er-border-color: #dcdfe6;
  --er-border-color-light: #e4e7ed;
  --er-border-color-lighter: #ebeef5;
  --er-border-color-extra-light: #f2f6fc;
  --er-border-color-dark: #d4d7de;
  --er-border-color-darker: #cdd0d6;
  --er-fill-color: #f0f2f5;
  --er-fill-color-light: #f5f7fa;
  --er-fill-color-lighter: #fafafa;
  --er-fill-color-extra-light: #fafcff;
  --er-fill-color-dark: #ebedf0;
  --er-fill-color-darker: #e6e8eb;
  --er-fill-color-blank: #ffffff;

  @each $val, $color in var(--colors) {
    --er-color-$(val): $(color);
    @for $i from 3 to 9 {
      --er-color-$(val)-light-$(i): mix(#fff, $(color), 0$ (i));
    }
    --er-color-$(val)-dark-2: mix(#000, $(color), 0.2);
  }

  /* border */
  --er-border-width: 1px;
  --er-border-style: solid;
  --er-border-color-hover: var(--er-text-color-disabled);
  --er-border: var(--er-border-width) var(--er-border-style)
    var(--er-border-color);
  --er-border-radius-base: 4px;
  --er-border-radius-small: 2px;
  --er-border-radius-round: 20px;
  --er-border-radius-circle: 100%;

  /*font*/
  --er-font-size-extra-large: 20px;
  --er-font-size-large: 18px;
  --er-font-size-medium: 16px;
  --er-font-size-base: 14px;
  --er-font-size-small: 13px;
  --er-font-size-extra-small: 12px;
  --er-font-family: "Helvetica Neue", Helvetica, "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", "\5fae\8f6f\96c5\9ed1", Arial,
    sans-serif;
  --er-font-weight-primary: 500;

  /*disabled*/
  --er-disabled-bg-color: var(--er-fill-color-light);
  --er-disabled-text-color: var(--er-text-color-placeholder);
  --er-disabled-border-color: var(--er-border-color-light);

  /*animation*/
  --er-transition-duration: 0.4s;
  --er-transition-duration-fast: 0.2s;
}
```

6、按钮样式, 新建 style.css， 具体请看代码注释
引入

```html
<style scoped>
  @import "./style.css";
</style>
```

7、去掉 playground 的默认样式

#### 十一、引入 storybook

1、官网——>get start ——> Vue with Vite ——> 复制命令 pnpm dlx storybook@latest init
确定在 play 下面 执行
然后选择项目类型 Vue3

最后会在 src 底下多一个 stories 目录。 他会生成自己的一个示例

2、改造
只留Button.stories.js, 并改成ts。代码全删了

```typescript
import type { Meta, StoryObj, ArgTypes } from "@storybook/vue3";
import { fn, within, userEvent, expect } from "@storybook/test";
import { ErButton } from "toy-element";
import "toy-element/dist/index.css";

type Story = StoryObj<typeof ErButton> & { argTypes?: ArgTypes };

const meta: Meta<typeof ErButton> = {
  title: "Example/Button",
  component: ErButton,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["primary", "success", "warning", "danger", "info", ""],
    },
    size: {
      control: { type: "select" },
      options: ["large", "default", "small", ""],
    },
    disabled: {
      control: "boolean",
    },
    loading: {
      control: "boolean",
    },
    useThrottle: {
      control: "boolean",
    },
    throttleDuration: {
      control: "number",
    },
    autofocus: {
      control: "boolean",
    },
    tag: {
      control: { type: "select" },
      options: ["button", "a", "div"],
    },
    nativeType: {
      control: { type: "select" },
      options: ["button", "submit", "reset", ""],
    },
    icon: {
      control: { type: "text" },
    },
    loadingIcon: {
      control: { type: "text" },
    },
  },
  args: { onClick: fn() },
};

const container = (val: string) => `
<div style="margin:5px">
  ${val}
</div>
`;

export const Default: Story & { args: { content: string } } = {
  argTypes: {
    content: {
      control: { type: "text" },
    },
  },
  args: {
    type: "primary",
    content: "Button",
  },
  render: (args) => ({
    components: { ErButton },
    setup() {
      return { args };
    },
    template: container(
      `<er-button v-bind="args">{{args.content}}</er-button>`
    ),
  }),
};

export default meta;
```

#### 十二、编写Icon组件

1、types.ts

```typescript
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface IconProps {
  border?: boolean;
  fixedWidth?: boolean;
  flip?: "horizontal" | "vertical" | "both";
  icon: object | Array<string> | string | IconDefinition;
  mask?: object | Array<string> | string;
  listItem?: boolean;
  pull?: "right" | "left";
  pulse?: boolean;
  rotation?: 90 | 180 | 270 | "90" | "180" | "270";
  swapOpacity?: boolean;
  size?:
    | "2xs"
    | "xs"
    | "sm"
    | "lg"
    | "xl"
    | "2xl"
    | "1x"
    | "2x"
    | "3x"
    | "4x"
    | "5x"
    | "6x"
    | "7x"
    | "8x"
    | "9x"
    | "10x";
  spin?: boolean;
  transform?: object | string;
  symbol?: boolean | string;
  title?: string;
  inverse?: boolean;
  bounce?: boolean;
  shake?: boolean;
  beat?: boolean;
  fade?: boolean;
  beatFade?: boolean;
  spinPulse?: boolean;
  spinReverse?: boolean;
  type?: "primary" | "success" | "warning" | "danger" | "info";
  color?: string;
}
```

Icon.vue

```vue
<script setup lang="ts">
import type { IconProps } from "./types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed } from "vue";
import { omit } from "lodash-es";

defineOptions({
  name: "ErIcon",
  inheriAttrs: false,
});

const props = defineProps<IconProps>();
const filterProps = computed(() => omit(props, ["type", "color"]));
const customStyles = computed(() => ({ color: props.color ?? void 0 }));
</script>

<template>
  <i
    class="er-icon"
    :class="[`er-icon-${props.type}`]"
    :style="customStyles"
    v-bind="$attrs"
  >
    <font-awesome-icon v-bind="filterProps" />
  </i>
</template>

<style scoped>
@import "./style.css";
</style>
```

2、在Button组件使用Icon
3、Icon组件在storybook报错

```shell
ReferenceError: Cannot access 'd' before initialization
```

要嘛去掉style的scoped, 要么vite.es.config.ts添加

```typescript
if (id.includes("/packages/utils") || id.includes("plugin-vue:export-helper")) {
  return "utils";
}
```

#### 十三、ButtonGroup组件

0、Vue的依赖注入
1、直接在Button目录创建ButtonGroup.vue
2、定义ButtonGroup的types

```typescript
export interface ButtonGroupProps {
  size?: ButtonSize;
  type?: ButtonType;
  disabled?: boolean;
}

export interface ButtonGroupContext {
  size?: ButtonSize;
  type?: ButtonType;
  disabled?: boolean;
}
```

3、新建contants.ts, 定义一个symbol, 作为依赖注入的key

```typescript
import type { InjectionKey } from "vue";
import type { ButtonGroupContext } from "./types";

export const BUTTON_GROUP_CTX_KEY: InjectionKey<ButtonGroupContext> = Symbol(
  "BUTTON_GROUP_CTX_KEY"
);
```

4、ButtonGroup的size、type、disabled属性会影响到Button组件

```vue
<script setup lang="ts">
import type { ButtonGroupProps } from "./types";
import { provide, reactive, toRef } from "vue";
import { BUTTON_GROUP_CTX_KEY } from "./contants";

defineOptions({
  name: "ErButtonGroup",
});
const props = defineProps<ButtonGroupProps>();

provide(
  BUTTON_GROUP_CTX_KEY,
  reactive({
    size: toRef(props, "size"),
    type: toRef(props, "type"),
    disabled: toRef(props, "disabled"),
  })
);
</script>

<template>
  <div class="er-button-group">
    <slot></slot>
  </div>
</template>

<style scoped>
@import "./style.css";
</style>
```

#### 十四、发布npm

1、一点优化
core的入口index.ts

```typescript
export * from "../components";
```

去掉 vitest.config.ts 生成的类型文件, 通过 tsconfig.build.json的exclude字段

```json
"exclude": ["packages/components/vitest.config.ts"]
```

之前分包打包组件, 用的是一个数组, 现在通过读目录的方式, 获取组件

```typescript
function getDirectoriesSync(basePath: string) {
  const entries = readdirSync(basePath, { withFileTypes: true });

  return map(
    filter(entries, (entry) => entry.isDirectory()),
    (entry) => entry.name
  );
}
```

2、nrm -- NPM registry manager

```shell
npm install -g nrm
```

查看所有的源

```shell
nrm ls
```

确保使用npm 源

```shell
nrm use npm
```

3、查看是否在登录

```shell
npm whoami
```

如果没有登录要去运行

```shell
npm login
```

4、我们要发布分包下面的dist产物。切到core目录
发布

```shell
npm publish
```

5、手工发布太麻烦了, 试着自动发布, 通过 release it
core安装 rimraf

```shell
pnpm add rimraf -Dw
pnpm add release-it -Dw
```

写scripts

```json
"clean": "rimraf dist",
"release": "release-it"
```

6、版本号

```shell
#语义化版本号的三个部分
在语义化版本控制（Semantic Versioning，简称SemVer）中，版本号由三个主要部分组成：主版本号
（MAJOR）、次版本号（MINOR）和修订号（PATCH），格式为：~主版本号，次版本号.修订号`。
#主版本号（MA】OR）---- Vue2 到 Vue3
当你做了不兼容的API修改时，增加主版本号。
这表示该版本可能包含重大更改，使用此新版本的用户可能需要对代码进行相应的修改。
#次版本号（MINOR）
当你添加了向下兼容的功能时，增加次版本号。
这意味着新版本添加了新功能，但现有的PI保持不变，因此使用新版本的用户不需要修改代码。
#修订号（PATCH）
~当你做了向下兼容的问题修正时，增加修订号。
-这表示新版本修复了一些问题，但并没有引入新功能，使用此版本的用户可以期望获得更稳定的体验。
#预发布版本标识符
可以附加一个预发布版本标识符（如`alpha，~beta`，rc等）来标识开发中的版本，通常用于测试阶段。#构建元数据
可以用于提供有关构建的附加信息，如构建时间或构建系统信息。
```

release的时候会默认执行 git push, 但是不会选择分支, 我们需要给他设定个默认分支

```shell
git push --set-upstream origin main
```
