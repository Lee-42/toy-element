import { makeInstaller } from "@toy-element/utils"
import components from "./components"

const installer = makeInstaller(components)

// 使用者在使用我们的包的时候, 可以以一个vue的plugin来使用, 用app.use() 来挂载到实例上面
export * from "@toy-element/components"
export default installer