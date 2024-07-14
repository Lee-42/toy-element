import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { compression } from "vite-plugin-compression2"
import { resolve } from "path"
import { readdir, readFileSync } from "fs"
import shell from "shelljs"
import { defer, delay } from "lodash-es"
import terser from "@rollup/plugin-terser"
import hooks from "./hooksPlugin"

const TRY_MOVE_STYLES_DELAY = 800

const isProd = process.env.NODE_ENV === "production"
const isDev = process.env.NODE_ENV === "development"
const isTest = process.env.NODE_ENV === "test"

function moveStyles() {
    readdir("./dist/es/theme", (err) => {
        if (err) return delay(moveStyles, TRY_MOVE_STYLES_DELAY)
        defer(() => shell.mv("./dist/es/theme", "./dist"))
    })
}

export default defineConfig({
    plugins: [vue(), compression({
        include: /.(cjs|css)$/i,
    }), hooks({
        rmFiles: ["./dist/umd", "./dist/index.css"],
        afterBuild: moveStyles
    }), terser({
        compress: {
            sequences: isProd,
            arguments: isProd,
            drop_console: isProd && ["log"],
            drop_debugger: isProd,
            passes: isProd ? 4 : 1,
            global_defs: {
                "@DEV": JSON.stringify(isDev),
                "@PROD": JSON.stringify(isProd),
                "@TEST": JSON.stringify(isTest)
            }
        },
    })],
    build: {
        outDir: "dist/umd",
        lib: {
            entry: resolve(__dirname, "./index.ts"),
            name: "ToyElement",
            fileName: "index",
            formats: ["umd"]
        },
        rollupOptions: {
            external: [
                "vue"  // umd格式的包, 我们要求用户要安装vue这个包, 其他图标什么的umd格式都包含了, 包会稍微大一点
            ],
            output: {
                exports: "named",
                globals: {
                    vue: "Vue"
                },
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === "style.css") return "index.css";
                    return assetInfo.name as string;
                }
            }
        }
    }
})