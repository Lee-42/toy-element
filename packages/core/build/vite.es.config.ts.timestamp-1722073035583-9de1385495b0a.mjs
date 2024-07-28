// build/vite.es.config.ts
import { defineConfig } from "file:///Volumes/T7/Project/toy-element/node_modules/.pnpm/vite@5.3.3_@types+node@20.14.10_terser@5.31.2/node_modules/vite/dist/node/index.js";
import vue from "file:///Volumes/T7/Project/toy-element/node_modules/.pnpm/@vitejs+plugin-vue@5.0.5_vite@5.3.3_@types+node@20.14.10_terser@5.31.2__vue@3.4.31_typescript@5.5.3_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "path";
import dts from "file:///Volumes/T7/Project/toy-element/node_modules/.pnpm/vite-plugin-dts@3.9.1_@types+node@20.14.10_rollup@4.18.0_typescript@5.5.3_vite@5.3.3_@types+node@20.14.10_terser@5.31.2_/node_modules/vite-plugin-dts/dist/index.mjs";
import { readdirSync } from "fs";
import { filter, map, delay, defer } from "file:///Volumes/T7/Project/toy-element/node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/lodash.js";
import shell2 from "file:///Volumes/T7/Project/toy-element/node_modules/.pnpm/shelljs@0.8.5/node_modules/shelljs/shell.js";
import { readdir } from "fs";
import terser from "file:///Volumes/T7/Project/toy-element/node_modules/.pnpm/@rollup+plugin-terser@0.4.4_rollup@4.18.0/node_modules/@rollup/plugin-terser/dist/es/index.js";

// build/hooksPlugin.ts
import { each, isFunction } from "file:///Volumes/T7/Project/toy-element/node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/lodash.js";
import shell from "file:///Volumes/T7/Project/toy-element/node_modules/.pnpm/shelljs@0.8.5/node_modules/shelljs/shell.js";
function hooksPlugin({
  rmFiles = [],
  beforeBuild,
  afterBuild
}) {
  return {
    name: "hooks-plugin",
    buildStart() {
      each(rmFiles, (fName) => shell.rm("-rf", fName));
      isFunction(beforeBuild) && beforeBuild();
    },
    buildEnd(err) {
      !err && isFunction(afterBuild) && afterBuild();
    }
  };
}

// build/vite.es.config.ts
var __vite_injected_original_dirname = "/Volumes/T7/Project/toy-element/packages/core/build";
var TRY_MOVE_STYLES_DELAY = 800;
var isProd = process.env.NODE_ENV === "production";
var isDev = process.env.NODE_ENV === "development";
var isTest = process.env.NODE_ENV === "test";
function getDirectoriesSync(basePath) {
  const entries = readdirSync(basePath, { withFileTypes: true });
  return map(
    filter(entries, (entry) => entry.isDirectory()),
    (entry) => entry.name
  );
}
function moveStyles() {
  readdir("./dist/es/theme", (err) => {
    if (err) return delay(moveStyles, TRY_MOVE_STYLES_DELAY);
    defer(() => shell2.mv("./dist/es/theme", "./dist"));
  });
}
var vite_es_config_default = defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: "../../tsconfig.build.json",
      outDir: "dist/types"
    }),
    hooksPlugin({
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
        comments: !isProd
      },
      mangle: {
        toplevel: isProd,
        eval: isProd,
        keep_classnames: isDev,
        keep_fnames: isDev
      }
    })
  ],
  build: {
    outDir: "dist/es",
    // minify: false,  // 关闭混淆, 通过插件来混淆
    // terserOptions: {
    //     compress: {},
    //     format: {},
    //     mangle: {}
    // },
    cssCodeSplit: true,
    // css分包
    lib: {
      entry: resolve(__vite_injected_original_dirname, "../index.ts"),
      name: "ToyElement",
      fileName: "index",
      formats: ["es"]
    },
    rollupOptions: {
      external: [
        "vue",
        // es 格式的要进行分包, 除了要安装vue之外, 还要安装图标
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
          if (assetInfo.type === "asset" && /\.(css)$/i.test(assetInfo.name)) {
            return "theme/[name].[ext]";
          }
          return assetInfo.name;
        },
        // 分包
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
          if (id.includes("/packages/hooks")) {
            return "hooks";
          }
          if (id.includes("/packages/utils") || id.includes("plugin-vue:export-helper")) {
            return "utils";
          }
          for (const dirName of getDirectoriesSync("../components")) {
            if (id.includes(`/packages/components/${dirName}`)) {
              return dirName;
            }
          }
        }
      }
    }
  }
});
export {
  vite_es_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYnVpbGQvdml0ZS5lcy5jb25maWcudHMiLCAiYnVpbGQvaG9va3NQbHVnaW4udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVm9sdW1lcy9UNy9Qcm9qZWN0L3RveS1lbGVtZW50L3BhY2thZ2VzL2NvcmUvYnVpbGRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Wb2x1bWVzL1Q3L1Byb2plY3QvdG95LWVsZW1lbnQvcGFja2FnZXMvY29yZS9idWlsZC92aXRlLmVzLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVm9sdW1lcy9UNy9Qcm9qZWN0L3RveS1lbGVtZW50L3BhY2thZ2VzL2NvcmUvYnVpbGQvdml0ZS5lcy5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiXG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIlxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCJcbmltcG9ydCBkdHMgZnJvbSBcInZpdGUtcGx1Z2luLWR0c1wiXG5pbXBvcnQgeyByZWFkZGlyU3luYyB9IGZyb20gXCJmc1wiXG5pbXBvcnQgeyBmaWx0ZXIsIG1hcCwgZGVsYXksIGRlZmVyIH0gZnJvbSBcImxvZGFzaC1lc1wiXG5pbXBvcnQgc2hlbGwgZnJvbSBcInNoZWxsanNcIlxuaW1wb3J0IHsgcmVhZGRpciB9IGZyb20gXCJmc1wiXG5pbXBvcnQgdGVyc2VyIGZyb20gXCJAcm9sbHVwL3BsdWdpbi10ZXJzZXJcIlxuaW1wb3J0IGhvb2tzIGZyb20gXCIuL2hvb2tzUGx1Z2luXCJcblxuY29uc3QgVFJZX01PVkVfU1RZTEVTX0RFTEFZID0gODAwXG5cbmNvbnN0IENPTVBfTkFNRVMgPSBbXG4gICAgXCJBbGVydFwiLFxuICAgIFwiQnV0dG9uXCIsXG4gICAgXCJDb2xsYXBzZVwiLFxuICAgIFwiRHJvcGRvd25cIixcbiAgICBcIkZvcm1cIixcbiAgICBcIkljb25cIixcbiAgICBcIklucHV0XCIsXG4gICAgXCJMb2FkaW5nXCIsXG4gICAgXCJNZXNzYWdlXCIsXG4gICAgXCJNZXNzYWdlQm94XCIsXG4gICAgXCJOb3RpZmljYXRpb25cIixcbiAgICBcIk92ZXJsYXlcIixcbiAgICBcIlBvcGNvbmZpcm1cIixcbiAgICBcIlNlbGVjdFwiLFxuICAgIFwiU3dpdGNoXCIsXG4gICAgXCJUb29sdGlwXCIsXG4gICAgXCJVcGxvYWRcIlxuXSBhcyBjb25zdFxuXG5jb25zdCBpc1Byb2QgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCJcbmNvbnN0IGlzRGV2ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwiZGV2ZWxvcG1lbnRcIlxuY29uc3QgaXNUZXN0ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwidGVzdFwiXG5cbmZ1bmN0aW9uIGdldERpcmVjdG9yaWVzU3luYyhiYXNlUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgZW50cmllcyA9IHJlYWRkaXJTeW5jKGJhc2VQYXRoLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XG5cbiAgICByZXR1cm4gbWFwKFxuICAgICAgICBmaWx0ZXIoZW50cmllcywgKGVudHJ5KSA9PiBlbnRyeS5pc0RpcmVjdG9yeSgpKSxcbiAgICAgICAgKGVudHJ5KSA9PiBlbnRyeS5uYW1lXG4gICAgKVxufVxuXG5mdW5jdGlvbiBtb3ZlU3R5bGVzKCkge1xuICAgIHJlYWRkaXIoXCIuL2Rpc3QvZXMvdGhlbWVcIiwgKGVycikgPT4ge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gZGVsYXkobW92ZVN0eWxlcywgVFJZX01PVkVfU1RZTEVTX0RFTEFZKVxuICAgICAgICBkZWZlcigoKSA9PiBzaGVsbC5tdihcIi4vZGlzdC9lcy90aGVtZVwiLCBcIi4vZGlzdFwiKSlcbiAgICB9KVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gICAgcGx1Z2luczogW3Z1ZSgpLCBkdHMoe1xuICAgICAgICB0c2NvbmZpZ1BhdGg6IFwiLi4vLi4vdHNjb25maWcuYnVpbGQuanNvblwiLFxuICAgICAgICBvdXREaXI6IFwiZGlzdC90eXBlc1wiXG4gICAgfSksXG4gICAgaG9va3Moe1xuICAgICAgICBybUZpbGVzOiBbXCIuL2Rpc3QvZXNcIiwgXCIuL2Rpc3QvdGhlbWVcIiwgXCIuL2Rpc3QvdHlwZXNcIl0sXG4gICAgICAgIGFmdGVyQnVpbGQ6IG1vdmVTdHlsZXNcbiAgICB9KSxcbiAgICB0ZXJzZXIoe1xuICAgICAgICBjb21wcmVzczoge1xuICAgICAgICAgICAgZHJvcF9jb25zb2xlOiBbXCJsb2dcIl0sXG4gICAgICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxuICAgICAgICAgICAgcGFzc2VzOiAzLFxuICAgICAgICAgICAgZ2xvYmFsX2RlZnM6IHtcbiAgICAgICAgICAgICAgICBcIkBERVZcIjogSlNPTi5zdHJpbmdpZnkoaXNEZXYpLFxuICAgICAgICAgICAgICAgIFwiQFBST0RcIjogSlNPTi5zdHJpbmdpZnkoaXNQcm9kKSxcbiAgICAgICAgICAgICAgICBcIkBURVNUXCI6IEpTT04uc3RyaW5naWZ5KGlzVGVzdClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZm9ybWF0OiB7XG4gICAgICAgICAgICBzZW1pY29sb25zOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3J0aGFuZDogaXNQcm9kLFxuICAgICAgICAgICAgYnJhY2VzOiAhaXNQcm9kLFxuICAgICAgICAgICAgYmVhdXRpZnk6ICFpc1Byb2QsXG4gICAgICAgICAgICBjb21tZW50czogIWlzUHJvZCxcbiAgICAgICAgfSxcbiAgICAgICAgbWFuZ2xlOiB7XG4gICAgICAgICAgICB0b3BsZXZlbDogaXNQcm9kLFxuICAgICAgICAgICAgZXZhbDogaXNQcm9kLFxuICAgICAgICAgICAga2VlcF9jbGFzc25hbWVzOiBpc0RldixcbiAgICAgICAgICAgIGtlZXBfZm5hbWVzOiBpc0RldlxuICAgICAgICB9XG4gICAgfSldLFxuICAgIGJ1aWxkOiB7XG4gICAgICAgIG91dERpcjogXCJkaXN0L2VzXCIsXG4gICAgICAgIC8vIG1pbmlmeTogZmFsc2UsICAvLyBcdTUxNzNcdTk1RURcdTZERjdcdTZEQzYsIFx1OTAxQVx1OEZDN1x1NjNEMlx1NEVGNlx1Njc2NVx1NkRGN1x1NkRDNlxuICAgICAgICAvLyB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICAgIC8vICAgICBjb21wcmVzczoge30sXG4gICAgICAgIC8vICAgICBmb3JtYXQ6IHt9LFxuICAgICAgICAvLyAgICAgbWFuZ2xlOiB7fVxuICAgICAgICAvLyB9LFxuICAgICAgICBjc3NDb2RlU3BsaXQ6IHRydWUsICAvLyBjc3NcdTUyMDZcdTUzMDVcbiAgICAgICAgbGliOiB7XG4gICAgICAgICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vaW5kZXgudHNcIiksXG4gICAgICAgICAgICBuYW1lOiBcIlRveUVsZW1lbnRcIixcbiAgICAgICAgICAgIGZpbGVOYW1lOiBcImluZGV4XCIsXG4gICAgICAgICAgICBmb3JtYXRzOiBbXCJlc1wiXVxuICAgICAgICB9LFxuICAgICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgICAgICBleHRlcm5hbDogW1xuICAgICAgICAgICAgICAgIFwidnVlXCIsIC8vIGVzIFx1NjgzQ1x1NUYwRlx1NzY4NFx1ODk4MVx1OEZEQlx1ODg0Q1x1NTIwNlx1NTMwNSwgXHU5NjY0XHU0RTg2XHU4OTgxXHU1Qjg5XHU4OEM1dnVlXHU0RTRCXHU1OTE2LCBcdThGRDhcdTg5ODFcdTVCODlcdTg4QzVcdTU2RkVcdTY4MDdcbiAgICAgICAgICAgICAgICBcIkBmb3J0YXdlc29tZS9mb250YXdlc29tZS1zdmctY29yZVwiLFxuICAgICAgICAgICAgICAgIFwiQGZvcnRhd2Vzb21lL2ZyZWUtc29saWQtc3ZnLWljb25zXCIsXG4gICAgICAgICAgICAgICAgXCJAZm9ydGF3ZXNvbWUvdnVlLWZvbnRhd2Vzb21lXCIsXG4gICAgICAgICAgICAgICAgXCJAcG9wcGVyanMvY29yZVwiLFxuICAgICAgICAgICAgICAgIFwiYXN5bmMtdmFsaWRhdG9yXCJcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAgICAgICBleHBvcnRzOiBcIm5hbWVkXCIsXG4gICAgICAgICAgICAgICAgZ2xvYmFsczoge1xuICAgICAgICAgICAgICAgICAgICB2dWU6IFwiVnVlXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhc3NldEluZm8ubmFtZSA9PT0gXCJzdHlsZS5jc3NcIikgcmV0dXJuIFwiaW5kZXguY3NzXCI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0SW5mby50eXBlID09PSBcImFzc2V0XCIgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIC9cXC4oY3NzKSQvaS50ZXN0KGFzc2V0SW5mby5uYW1lIGFzIHN0cmluZylcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJ0aGVtZS9bbmFtZV0uW2V4dF1cIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXNzZXRJbmZvLm5hbWUgYXMgc3RyaW5nO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLy8gXHU1MjA2XHU1MzA1XG4gICAgICAgICAgICAgICAgbWFudWFsQ2h1bmtzKGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlkXHU2NjJGXHU4REVGXHU1Rjg0XG4gICAgICAgICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcIm5vZGVfbW9kdWxlc1wiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwidmVuZG9yXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoXCIvcGFja2FnZXMvaG9va3NcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcImhvb2tzXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoXCIvcGFja2FnZXMvdXRpbHNcIikgfHwgaWQuaW5jbHVkZXMoXCJwbHVnaW4tdnVlOmV4cG9ydC1oZWxwZXJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcInV0aWxzXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGRpck5hbWUgb2YgZ2V0RGlyZWN0b3JpZXNTeW5jKFwiLi4vY29tcG9uZW50c1wiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKGAvcGFja2FnZXMvY29tcG9uZW50cy8ke2Rpck5hbWV9YCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGlyTmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSkiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Wb2x1bWVzL1Q3L1Byb2plY3QvdG95LWVsZW1lbnQvcGFja2FnZXMvY29yZS9idWlsZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1ZvbHVtZXMvVDcvUHJvamVjdC90b3ktZWxlbWVudC9wYWNrYWdlcy9jb3JlL2J1aWxkL2hvb2tzUGx1Z2luLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Wb2x1bWVzL1Q3L1Byb2plY3QvdG95LWVsZW1lbnQvcGFja2FnZXMvY29yZS9idWlsZC9ob29rc1BsdWdpbi50c1wiO2ltcG9ydCB7IGVhY2gsIGlzRnVuY3Rpb24gfSBmcm9tIFwibG9kYXNoLWVzXCJcbmltcG9ydCBzaGVsbCBmcm9tIFwic2hlbGxqc1wiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGhvb2tzUGx1Z2luKHtcbiAgICBybUZpbGVzID0gW10sXG4gICAgYmVmb3JlQnVpbGQsXG4gICAgYWZ0ZXJCdWlsZFxufToge1xuICAgIHJtRmlsZXM/OiBzdHJpbmdbXTtcbiAgICBiZWZvcmVCdWlsZD86IEZ1bmN0aW9uO1xuICAgIGFmdGVyQnVpbGQ/OiBGdW5jdGlvbjtcbn0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBcImhvb2tzLXBsdWdpblwiLFxuICAgICAgICBidWlsZFN0YXJ0KCkge1xuICAgICAgICAgICAgZWFjaChybUZpbGVzLCAoZk5hbWUpID0+IHNoZWxsLnJtKFwiLXJmXCIsIGZOYW1lKSlcbiAgICAgICAgICAgIGlzRnVuY3Rpb24oYmVmb3JlQnVpbGQpICYmIGJlZm9yZUJ1aWxkKClcbiAgICAgICAgfSxcbiAgICAgICAgYnVpbGRFbmQoZXJyPzogRXJyb3IpIHtcbiAgICAgICAgICAgICFlcnIgJiYgaXNGdW5jdGlvbihhZnRlckJ1aWxkKSAmJiBhZnRlckJ1aWxkKClcbiAgICAgICAgfVxuICAgIH1cbn0iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlWLFNBQVMsb0JBQW9CO0FBQzlXLE9BQU8sU0FBUztBQUNoQixTQUFTLGVBQWU7QUFDeEIsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsbUJBQW1CO0FBQzVCLFNBQVMsUUFBUSxLQUFLLE9BQU8sYUFBYTtBQUMxQyxPQUFP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
