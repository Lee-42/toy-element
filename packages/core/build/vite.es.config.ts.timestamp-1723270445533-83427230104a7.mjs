// build/vite.es.config.ts
import { defineConfig } from "file:///Volumes/T7/Project/toy-element/node_modules/.pnpm/vite@5.3.3_@types+node@20.14.10_terser@5.31.2/node_modules/vite/dist/node/index.js";
import vue from "file:///Volumes/T7/Project/toy-element/node_modules/.pnpm/@vitejs+plugin-vue@5.0.5_vite@5.3.3_@types+node@20.14.10_terser@5.31.2__vue@3.4.31_typescript@5.5.3_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "path";
import dts from "file:///Volumes/T7/Project/toy-element/node_modules/.pnpm/vite-plugin-dts@3.9.1_@types+node@20.14.10_rollup@4.18.0_typescript@5.5.3_vite@5.3.3_@types+node@20.14.10_terser@5.31.2_/node_modules/vite-plugin-dts/dist/index.mjs";
import { readdirSync } from "fs";
import { filter, map, delay, defer } from "file:///Volumes/T7/Project/toy-element/node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/lodash.js";
import shell from "file:///Volumes/T7/Project/toy-element/node_modules/.pnpm/shelljs@0.8.5/node_modules/shelljs/shell.js";
import { readdir } from "fs";
import terser from "file:///Volumes/T7/Project/toy-element/node_modules/.pnpm/@rollup+plugin-terser@0.4.4_rollup@4.18.0/node_modules/@rollup/plugin-terser/dist/es/index.js";
import { hookPlugin as hooks } from "file:///Volumes/T7/Project/toy-element/libs/vite-plugins/.dist/index.js";
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
    defer(() => shell.mv("./dist/es/theme", "./dist"));
  });
}
console.log("eseseseses");
var vite_es_config_default = defineConfig({
  plugins: [
    vue(),
    dts({
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYnVpbGQvdml0ZS5lcy5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVm9sdW1lcy9UNy9Qcm9qZWN0L3RveS1lbGVtZW50L3BhY2thZ2VzL2NvcmUvYnVpbGRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Wb2x1bWVzL1Q3L1Byb2plY3QvdG95LWVsZW1lbnQvcGFja2FnZXMvY29yZS9idWlsZC92aXRlLmVzLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVm9sdW1lcy9UNy9Qcm9qZWN0L3RveS1lbGVtZW50L3BhY2thZ2VzL2NvcmUvYnVpbGQvdml0ZS5lcy5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiXG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIlxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCJcbmltcG9ydCBkdHMgZnJvbSBcInZpdGUtcGx1Z2luLWR0c1wiXG5pbXBvcnQgeyByZWFkZGlyU3luYyB9IGZyb20gXCJmc1wiXG5pbXBvcnQgeyBmaWx0ZXIsIG1hcCwgZGVsYXksIGRlZmVyIH0gZnJvbSBcImxvZGFzaC1lc1wiXG5pbXBvcnQgc2hlbGwgZnJvbSBcInNoZWxsanNcIlxuaW1wb3J0IHsgcmVhZGRpciB9IGZyb20gXCJmc1wiXG5pbXBvcnQgdGVyc2VyIGZyb20gXCJAcm9sbHVwL3BsdWdpbi10ZXJzZXJcIlxuaW1wb3J0IHsgaG9va1BsdWdpbiBhcyBob29rcyB9IGZyb20gXCJAdG95LWVsZW1lbnQvdml0ZS1wbHVnaW5zXCJcblxuY29uc3QgVFJZX01PVkVfU1RZTEVTX0RFTEFZID0gODAwXG5cbmNvbnN0IGlzUHJvZCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIlxuY29uc3QgaXNEZXYgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJkZXZlbG9wbWVudFwiXG5jb25zdCBpc1Rlc3QgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJ0ZXN0XCJcblxuZnVuY3Rpb24gZ2V0RGlyZWN0b3JpZXNTeW5jKGJhc2VQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBlbnRyaWVzID0gcmVhZGRpclN5bmMoYmFzZVBhdGgsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KTtcblxuICAgIHJldHVybiBtYXAoXG4gICAgICAgIGZpbHRlcihlbnRyaWVzLCAoZW50cnkpID0+IGVudHJ5LmlzRGlyZWN0b3J5KCkpLFxuICAgICAgICAoZW50cnkpID0+IGVudHJ5Lm5hbWVcbiAgICApXG59XG5cbmZ1bmN0aW9uIG1vdmVTdHlsZXMoKSB7XG4gICAgcmVhZGRpcihcIi4vZGlzdC9lcy90aGVtZVwiLCAoZXJyKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHJldHVybiBkZWxheShtb3ZlU3R5bGVzLCBUUllfTU9WRV9TVFlMRVNfREVMQVkpXG4gICAgICAgIGRlZmVyKCgpID0+IHNoZWxsLm12KFwiLi9kaXN0L2VzL3RoZW1lXCIsIFwiLi9kaXN0XCIpKVxuICAgIH0pXG59XG5cbmNvbnNvbGUubG9nKFwiZXNlc2VzZXNlc1wiKVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIHBsdWdpbnM6IFt2dWUoKSwgZHRzKHtcbiAgICAgICAgdHNjb25maWdQYXRoOiBcIi4uLy4uL3RzY29uZmlnLmJ1aWxkLmpzb25cIixcbiAgICAgICAgb3V0RGlyOiBcImRpc3QvdHlwZXNcIlxuICAgIH0pLFxuICAgIGhvb2tzKHtcbiAgICAgICAgcm1GaWxlczogW1wiLi9kaXN0L2VzXCIsIFwiLi9kaXN0L3RoZW1lXCIsIFwiLi9kaXN0L3R5cGVzXCJdLFxuICAgICAgICBhZnRlckJ1aWxkOiBtb3ZlU3R5bGVzXG4gICAgfSksXG4gICAgdGVyc2VyKHtcbiAgICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgICAgIGRyb3BfY29uc29sZTogW1wibG9nXCJdLFxuICAgICAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSxcbiAgICAgICAgICAgIHBhc3NlczogMyxcbiAgICAgICAgICAgIGdsb2JhbF9kZWZzOiB7XG4gICAgICAgICAgICAgICAgXCJAREVWXCI6IEpTT04uc3RyaW5naWZ5KGlzRGV2KSxcbiAgICAgICAgICAgICAgICBcIkBQUk9EXCI6IEpTT04uc3RyaW5naWZ5KGlzUHJvZCksXG4gICAgICAgICAgICAgICAgXCJAVEVTVFwiOiBKU09OLnN0cmluZ2lmeShpc1Rlc3QpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGZvcm1hdDoge1xuICAgICAgICAgICAgc2VtaWNvbG9uczogZmFsc2UsXG4gICAgICAgICAgICBzaG9ydGhhbmQ6IGlzUHJvZCxcbiAgICAgICAgICAgIGJyYWNlczogIWlzUHJvZCxcbiAgICAgICAgICAgIGJlYXV0aWZ5OiAhaXNQcm9kLFxuICAgICAgICAgICAgY29tbWVudHM6ICFpc1Byb2QsXG4gICAgICAgIH0sXG4gICAgICAgIG1hbmdsZToge1xuICAgICAgICAgICAgdG9wbGV2ZWw6IGlzUHJvZCxcbiAgICAgICAgICAgIGV2YWw6IGlzUHJvZCxcbiAgICAgICAgICAgIGtlZXBfY2xhc3NuYW1lczogaXNEZXYsXG4gICAgICAgICAgICBrZWVwX2ZuYW1lczogaXNEZXZcbiAgICAgICAgfVxuICAgIH0pXSxcbiAgICBidWlsZDoge1xuICAgICAgICBvdXREaXI6IFwiZGlzdC9lc1wiLFxuICAgICAgICAvLyBtaW5pZnk6IGZhbHNlLCAgLy8gXHU1MTczXHU5NUVEXHU2REY3XHU2REM2LCBcdTkwMUFcdThGQzdcdTYzRDJcdTRFRjZcdTY3NjVcdTZERjdcdTZEQzZcbiAgICAgICAgLy8gdGVyc2VyT3B0aW9uczoge1xuICAgICAgICAvLyAgICAgY29tcHJlc3M6IHt9LFxuICAgICAgICAvLyAgICAgZm9ybWF0OiB7fSxcbiAgICAgICAgLy8gICAgIG1hbmdsZToge31cbiAgICAgICAgLy8gfSxcbiAgICAgICAgY3NzQ29kZVNwbGl0OiB0cnVlLCAgLy8gY3NzXHU1MjA2XHU1MzA1XG4gICAgICAgIGxpYjoge1xuICAgICAgICAgICAgZW50cnk6IHJlc29sdmUoX19kaXJuYW1lLCBcIi4uL2luZGV4LnRzXCIpLFxuICAgICAgICAgICAgbmFtZTogXCJUb3lFbGVtZW50XCIsXG4gICAgICAgICAgICBmaWxlTmFtZTogXCJpbmRleFwiLFxuICAgICAgICAgICAgZm9ybWF0czogW1wiZXNcIl1cbiAgICAgICAgfSxcbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgICAgZXh0ZXJuYWw6IFtcbiAgICAgICAgICAgICAgICBcInZ1ZVwiLCAvLyBlcyBcdTY4M0NcdTVGMEZcdTc2ODRcdTg5ODFcdThGREJcdTg4NENcdTUyMDZcdTUzMDUsIFx1OTY2NFx1NEU4Nlx1ODk4MVx1NUI4OVx1ODhDNXZ1ZVx1NEU0Qlx1NTkxNiwgXHU4RkQ4XHU4OTgxXHU1Qjg5XHU4OEM1XHU1NkZFXHU2ODA3XG4gICAgICAgICAgICAgICAgXCJAZm9ydGF3ZXNvbWUvZm9udGF3ZXNvbWUtc3ZnLWNvcmVcIixcbiAgICAgICAgICAgICAgICBcIkBmb3J0YXdlc29tZS9mcmVlLXNvbGlkLXN2Zy1pY29uc1wiLFxuICAgICAgICAgICAgICAgIFwiQGZvcnRhd2Vzb21lL3Z1ZS1mb250YXdlc29tZVwiLFxuICAgICAgICAgICAgICAgIFwiQHBvcHBlcmpzL2NvcmVcIixcbiAgICAgICAgICAgICAgICBcImFzeW5jLXZhbGlkYXRvclwiXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICAgICAgZXhwb3J0czogXCJuYW1lZFwiLFxuICAgICAgICAgICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgdnVlOiBcIlZ1ZVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhc3NldEZpbGVOYW1lczogKGFzc2V0SW5mbykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXNzZXRJbmZvLm5hbWUgPT09IFwic3R5bGUuY3NzXCIpIHJldHVybiBcImluZGV4LmNzc1wiO1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3NldEluZm8udHlwZSA9PT0gXCJhc3NldFwiICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAvXFwuKGNzcykkL2kudGVzdChhc3NldEluZm8ubmFtZSBhcyBzdHJpbmcpXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwidGhlbWUvW25hbWVdLltleHRdXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFzc2V0SW5mby5uYW1lIGFzIHN0cmluZztcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8vIFx1NTIwNlx1NTMwNVxuICAgICAgICAgICAgICAgIG1hbnVhbENodW5rcyhpZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZFx1NjYyRlx1OERFRlx1NUY4NFxuICAgICAgICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoXCJub2RlX21vZHVsZXNcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcInZlbmRvclwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKFwiL3BhY2thZ2VzL2hvb2tzXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJob29rc1wiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKFwiL3BhY2thZ2VzL3V0aWxzXCIpIHx8IGlkLmluY2x1ZGVzKFwicGx1Z2luLXZ1ZTpleHBvcnQtaGVscGVyXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJ1dGlsc1wiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBkaXJOYW1lIG9mIGdldERpcmVjdG9yaWVzU3luYyhcIi4uL2NvbXBvbmVudHNcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhgL3BhY2thZ2VzL2NvbXBvbmVudHMvJHtkaXJOYW1lfWApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRpck5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFpVixTQUFTLG9CQUFvQjtBQUM5VyxPQUFPLFNBQVM7QUFDaEIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sU0FBUztBQUNoQixTQUFTLG1CQUFtQjtBQUM1QixTQUFTLFFBQVEsS0FBSyxPQUFPLGFBQWE7QUFDMUMsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUN4QixPQUFPLFlBQVk7QUFDbkIsU0FBUyxjQUFjLGFBQWE7QUFUcEMsSUFBTSxtQ0FBbUM7QUFXekMsSUFBTSx3QkFBd0I7QUFFOUIsSUFBTSxTQUFTLFFBQVEsSUFBSSxhQUFhO0FBQ3hDLElBQU0sUUFBUSxRQUFRLElBQUksYUFBYTtBQUN2QyxJQUFNLFNBQVMsUUFBUSxJQUFJLGFBQWE7QUFFeEMsU0FBUyxtQkFBbUIsVUFBa0I7QUFDMUMsUUFBTSxVQUFVLFlBQVksVUFBVSxFQUFFLGVBQWUsS0FBSyxDQUFDO0FBRTdELFNBQU87QUFBQSxJQUNILE9BQU8sU0FBUyxDQUFDLFVBQVUsTUFBTSxZQUFZLENBQUM7QUFBQSxJQUM5QyxD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
