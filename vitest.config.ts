/// <reference types="vitest" />
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import { resolve } from "path"

export default defineConfig({
    plugins: [vue(), vueJsx()], // vueJsx 因为我们每个测试用例都是用tsx去读, 所以要用这个插件去读
    define: {
        PROD: JSON.stringify(false),
        DEV: JSON.stringify(false),
        TEST: JSON.stringify(true),
    },
    test: {
        globals: true,
        environment: "jsdom",
        exclude: [
            "**/node_modules/**",
            "**/dist/**",
            "**/true/coverage/**",
            "**/coverage/**"
        ],
        setupFiles: [resolve(__dirname, "./vitest.setup.ts")]
    }
})