import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"

export default defineConfig({
    plugins: [vue()],
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