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




