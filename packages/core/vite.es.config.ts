import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"
import dts from "vite-plugin-dts"
import { readdirSync } from "fs"
import { filter, map } from "lodash-es"

const COMP_NAMES = [
    "Alert",
    "Button",
    "Collapse",
    "Dropdown",
    "Form",
    "Icon",
    "Input",
    "Loading",
    "Message",
    "MessageBox",
    "Notification",
    "Overlay",
    "Popconfirm",
    "Select",
    "Switch",
    "Tooltip",
    "Upload"
] as const

function getDirectoriesSync(basePath: string) {
    const entries = readdirSync(basePath, { withFileTypes: true });

    return map(
        filter(entries, (entry) => entry.isDirectory()),
        (entry) => entry.name
    )
}

export default defineConfig({
    plugins: [vue(), dts({
        tsconfigPath: "../../tsconfig.build.json",
        outDir: "dist/types"
    })],
    build: {
        outDir: "dist/es",
        lib: {
            entry: resolve(__dirname, "./index.ts"),
            name: "ToyElement",
            fileName: "index",
            formats: ["es"]
        },
        rollupOptions: {
            external: [
                "vue", // es 格式的要进行分包, 除了要安装vue之外, 还要安装图标
                "@fortawesome/fontawesome-svg-core",
                "@fortawesome/free-solid-svg-icons",
                "@fortawesome/vue-fontawesome",
                "@popperjs/core",
                "async-validator"
            ],
            output: {
                exports: "named",
                globals: {
                    vue: "Vue"
                },
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === "style.css") return "index.css";
                    return assetInfo.name as string;
                },
                // 分包
                manualChunks(id) {
                    // id是路径
                    if (id.includes("node_modules")) {
                        return "vendor"
                    }
                    if (id.includes("/packages/hooks")) {
                        return "hooks"
                    }
                    if (id.includes("/packages/utils") || id.includes("plugin-vue:export-helper")) {
                        return "utils"
                    }
                    for (const dirName of getDirectoriesSync("../components")) {
                        if (id.includes(`/packages/components/${dirName}`)) {
                            return dirName
                        }
                    }
                }
            }
        }
    }
})