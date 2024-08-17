#### 一、Alert组件

1、

#### 二、Vitepress组件文档

1、基本上就是写markdown, 其中代码预览用到了 vitepress-demo-preview
2、可能要将 vitepress-preview-component 进行修改后, 作为子包放到项目里

#### 三、提高测试覆盖率

1、将components测试相关的依赖移动到根目录的package.json, vitest.config.ts也是移动到根目录
因为还要对utils、hooks进行测试
然后每个包增加test脚本

```json
"test": "vitest --coverage"
```

2、utils的测试用例

#### 三、Tooltip组件

1、这里用到一个库做定位 popperjs
https://juejin.cn/post/7360509135777546277

#### 四、编写hook的测试用例

1、新建hook/**test**

2、抽出hooksPlugin, 新建libs/vite-plugins
3、pnpm-workspace.yaml增加

```yaml
packages:
  - "packages/*"
  - "libs/*"
```

根package.json增加

```json
"@toy-element/vite-plugins": "workspace:*",
```

之后所有使用到 vite-plugins的地方都换成

```js
import { hookPlugin as hooks } from "@toy-element/vite-plugins";
```

4、hooks/pakage.json 增加脚本

```js
"build": "vite build"
```

由于component依赖于hooks, 所以component的build之前还需要build hooks

5、hook build之后进行改造

#### 五、popconfirm组件
1、依赖于tooltip
2、新建style.ts, 实现addUnit方法

#### 六、DropDown
1、

#### 七、useDisabledStyle、国际化
1、i18n、i10n
2、 安装
```shell
pnpm add vue3-i18n -Dw
```
3、packages新建locale目录， npm init
```json
{
  "name": "@toy-element/locale",
  "version": "1.0.0",
  "description": "",
  "main": "index.ts",
  "module": "index.ts",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```
拷贝名称到根目录的pakage.json
然后切到根目录执行pnpm i

4、新建index.ts
```ts
export { default as en } from './lang/en'
export { default as ja } from './lang/ja'
export { default as ko } from './lang/ko'
export { default as zhCn } from './lang/zh-cn'
export { default as zhTw } from './lang/zh-tw'

export type TranslatePair = {
    [key: string]: string | string[] | TranslatePair
}

export type Language = {
    name: string
    el: TranslatePair
}
```

5、新建useLocale.ts
```ts
import { inject, type Ref } from "vue"
import { omit } from 'lodash-es'
import { createI18n, i18nSymbol, type I18nInstance } from 'vue3-i18n'
import type { Language } from "@toy-element/locale"
import English from "@toy-element/locale/lang/en"

export function useLocale(localeOverrides?: Ref<Language>) {
    if (!localeOverrides) {
        return omit(<I18nInstance>(inject(i18nSymbol, createI18n({ locale: English.name, messages: { en: English.el } }))))
    }
    return omit(createI18n({
        locale: localeOverrides.value.name,
        messages: {
            en: English.el,
            [localeOverrides.value.name]: localeOverrides.value.el
        }
    }))
}
```

6、新建ConfigProvider组件
makeInstaller.ts


#### 八、message组件
1、指令式的调用方式





