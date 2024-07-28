import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"
import dts from "vite-plugin-dts"
import { readdirSync } from "fs"
import { filter, map, delay, defer } from "lodash-es"
import shell from "shelljs"
import { readdir } from "fs"
import terser from "@rollup/plugin-terser"
import hooks from "./hooksPlugin"

const TRY_MOVE_STYLES_DELAY = 800

const isProd = process.env.NODE_ENV === "production"
const isDev = process.env.NODE_ENV === "development"
const isTest = process.env.NODE_ENV === "test"

function getDirectoriesSync(basePath: string) {
    const entries = readdirSync(basePath, { withFileTypes: true });

    return map(
        filter(entries, (entry) => entry.isDirectory()),
        (entry) => entry.name
    )
}

function moveStyles() {
    readdir("./dist/es/theme", (err) => {
        if (err) return delay(moveStyles, TRY_MOVE_STYLES_DELAY)
        defer(() => shell.mv("./dist/es/theme", "./dist"))
    })
}

console.log("eseseseses")

export default defineConfig({
    plugins: [vue(), dts({
        tsconfigPath: "../../tsconfig.build.json",
        outDir: "dist/types"
    }),
    hooks({
        rmFiles: ["./dist/es", "./dist/theme", "./dist/types"],
        afterBuild: moveStyles
    }),
    terser({
        compress: {
            drop_console: ["log"],
            drop_debugger: true,
            passes: 3,
            global_defs: {
                "@DEV": JSON.stringify(isDev),
                "@PROD": JSON.stringify(isProd),
                "@TEST": JSON.stringify(isTest)
            }
        },
        format: {
            semicolons: false,
            shorthand: isProd,
            braces: !isProd,
            beautify: !isProd,
            comments: !isProd,
        },
        mangle: {
            toplevel: isProd,
            eval: isProd,
            keep_classnames: isDev,
            keep_fnames: isDev
        }
    })],
    build: {
        outDir: "dist/es",
        // minify: false,  // 关闭混淆, 通过插件来混淆
        // terserOptions: {
        //     compress: {},
        //     format: {},
        //     mangle: {}
        // },
        cssCodeSplit: true,  // css分包
        lib: {
            entry: resolve(__dirname, "../index.ts"),
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
                    if (
                        assetInfo.type === "asset" &&
                        /\.(css)$/i.test(assetInfo.name as string)
                    ) {
                        return "theme/[name].[ext]";
                    }
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