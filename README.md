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
处理 core 叫 "toy-element", 其他都叫 "@toy-element/components"、"@toy-element/docs"。。。。
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
