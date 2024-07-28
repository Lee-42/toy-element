// build/vite.es.config.ts
import { defineConfig } from "file:///Volumes/T7/Project/toy-element/node_modules/.pnpm/vite@5.3.3_@types+node@20.14.10_terser@5.31.2/node_modules/vite/dist/node/index.js";
import vue from "file:///Volumes/T7/Project/toy-element/node_modules/.pnpm/@vitejs+plugin-vue@5.0.5_vite@5.3.3_@types+node@20.14.10_terser@5.31.2__vue@3.4.31_typescript@5.5.3_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "path";
import dts from "file:///Volumes/T7/Project/toy-element/node_modules/.pnpm/vite-plugin-dts@3.9.1_@types+node@20.14.10_rollup@4.18.0_typescript@5.5.3_vite@5.3.3_@types+node@20.14.10_terser@5.31.2_/node_modules/vite-plugin-dts/dist/index.mjs";
import { readdirSync } from "fs";
import { filter, map, delay, defer } from "file:///Volumes/T7/Project/toy-element/node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/lodash.js";
import shell from "file:///Volumes/T7/Project/toy-element/node_modules/.pnpm/shelljs@0.8.5/node_modules/shelljs/shell.js";
import terser from "file:///Volumes/T7/Project/toy-element/node_modules/.pnpm/@rollup+plugin-terser@0.4.4_rollup@4.18.0/node_modules/@rollup/plugin-terser/dist/es/index.js";
var __vite_injected_original_dirname = "/Volumes/T7/Project/toy-element/packages/core/build";
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
var vite_es_config_default = defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: "../../tsconfig.build.json",
      outDir: "dist/types"
    }),
    // hooks({
    //     rmFiles: ["./dist/es", "./dist/theme", "./dist/types"],
    //     afterBuild: moveStyles
    // }),
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYnVpbGQvdml0ZS5lcy5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVm9sdW1lcy9UNy9Qcm9qZWN0L3RveS1lbGVtZW50L3BhY2thZ2VzL2NvcmUvYnVpbGRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Wb2x1bWVzL1Q3L1Byb2plY3QvdG95LWVsZW1lbnQvcGFja2FnZXMvY29yZS9idWlsZC92aXRlLmVzLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVm9sdW1lcy9UNy9Qcm9qZWN0L3RveS1lbGVtZW50L3BhY2thZ2VzL2NvcmUvYnVpbGQvdml0ZS5lcy5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiXG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIlxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCJcbmltcG9ydCBkdHMgZnJvbSBcInZpdGUtcGx1Z2luLWR0c1wiXG5pbXBvcnQgeyByZWFkZGlyU3luYyB9IGZyb20gXCJmc1wiXG5pbXBvcnQgeyBmaWx0ZXIsIG1hcCwgZGVsYXksIGRlZmVyIH0gZnJvbSBcImxvZGFzaC1lc1wiXG5pbXBvcnQgc2hlbGwgZnJvbSBcInNoZWxsanNcIlxuaW1wb3J0IHsgcmVhZGRpciB9IGZyb20gXCJmc1wiXG5pbXBvcnQgdGVyc2VyIGZyb20gXCJAcm9sbHVwL3BsdWdpbi10ZXJzZXJcIlxuaW1wb3J0IGhvb2tzIGZyb20gXCIuL2hvb2tzUGx1Z2luXCJcblxuY29uc3QgVFJZX01PVkVfU1RZTEVTX0RFTEFZID0gODAwXG5cbmNvbnN0IGlzUHJvZCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIlxuY29uc3QgaXNEZXYgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJkZXZlbG9wbWVudFwiXG5jb25zdCBpc1Rlc3QgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJ0ZXN0XCJcblxuZnVuY3Rpb24gZ2V0RGlyZWN0b3JpZXNTeW5jKGJhc2VQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBlbnRyaWVzID0gcmVhZGRpclN5bmMoYmFzZVBhdGgsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KTtcblxuICAgIHJldHVybiBtYXAoXG4gICAgICAgIGZpbHRlcihlbnRyaWVzLCAoZW50cnkpID0+IGVudHJ5LmlzRGlyZWN0b3J5KCkpLFxuICAgICAgICAoZW50cnkpID0+IGVudHJ5Lm5hbWVcbiAgICApXG59XG5cbmZ1bmN0aW9uIG1vdmVTdHlsZXMoKSB7XG4gICAgcmVhZGRpcihcIi4vZGlzdC9lcy90aGVtZVwiLCAoZXJyKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHJldHVybiBkZWxheShtb3ZlU3R5bGVzLCBUUllfTU9WRV9TVFlMRVNfREVMQVkpXG4gICAgICAgIGRlZmVyKCgpID0+IHNoZWxsLm12KFwiLi9kaXN0L2VzL3RoZW1lXCIsIFwiLi9kaXN0XCIpKVxuICAgIH0pXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBwbHVnaW5zOiBbdnVlKCksIGR0cyh7XG4gICAgICAgIHRzY29uZmlnUGF0aDogXCIuLi8uLi90c2NvbmZpZy5idWlsZC5qc29uXCIsXG4gICAgICAgIG91dERpcjogXCJkaXN0L3R5cGVzXCJcbiAgICB9KSxcbiAgICAvLyBob29rcyh7XG4gICAgLy8gICAgIHJtRmlsZXM6IFtcIi4vZGlzdC9lc1wiLCBcIi4vZGlzdC90aGVtZVwiLCBcIi4vZGlzdC90eXBlc1wiXSxcbiAgICAvLyAgICAgYWZ0ZXJCdWlsZDogbW92ZVN0eWxlc1xuICAgIC8vIH0pLFxuICAgIHRlcnNlcih7XG4gICAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgICAgICBkcm9wX2NvbnNvbGU6IFtcImxvZ1wiXSxcbiAgICAgICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWUsXG4gICAgICAgICAgICBwYXNzZXM6IDMsXG4gICAgICAgICAgICBnbG9iYWxfZGVmczoge1xuICAgICAgICAgICAgICAgIFwiQERFVlwiOiBKU09OLnN0cmluZ2lmeShpc0RldiksXG4gICAgICAgICAgICAgICAgXCJAUFJPRFwiOiBKU09OLnN0cmluZ2lmeShpc1Byb2QpLFxuICAgICAgICAgICAgICAgIFwiQFRFU1RcIjogSlNPTi5zdHJpbmdpZnkoaXNUZXN0KVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmb3JtYXQ6IHtcbiAgICAgICAgICAgIHNlbWljb2xvbnM6IGZhbHNlLFxuICAgICAgICAgICAgc2hvcnRoYW5kOiBpc1Byb2QsXG4gICAgICAgICAgICBicmFjZXM6ICFpc1Byb2QsXG4gICAgICAgICAgICBiZWF1dGlmeTogIWlzUHJvZCxcbiAgICAgICAgICAgIGNvbW1lbnRzOiAhaXNQcm9kLFxuICAgICAgICB9LFxuICAgICAgICBtYW5nbGU6IHtcbiAgICAgICAgICAgIHRvcGxldmVsOiBpc1Byb2QsXG4gICAgICAgICAgICBldmFsOiBpc1Byb2QsXG4gICAgICAgICAgICBrZWVwX2NsYXNzbmFtZXM6IGlzRGV2LFxuICAgICAgICAgICAga2VlcF9mbmFtZXM6IGlzRGV2XG4gICAgICAgIH1cbiAgICB9KV0sXG4gICAgYnVpbGQ6IHtcbiAgICAgICAgb3V0RGlyOiBcImRpc3QvZXNcIixcbiAgICAgICAgLy8gbWluaWZ5OiBmYWxzZSwgIC8vIFx1NTE3M1x1OTVFRFx1NkRGN1x1NkRDNiwgXHU5MDFBXHU4RkM3XHU2M0QyXHU0RUY2XHU2NzY1XHU2REY3XHU2REM2XG4gICAgICAgIC8vIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgICAgLy8gICAgIGNvbXByZXNzOiB7fSxcbiAgICAgICAgLy8gICAgIGZvcm1hdDoge30sXG4gICAgICAgIC8vICAgICBtYW5nbGU6IHt9XG4gICAgICAgIC8vIH0sXG4gICAgICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSwgIC8vIGNzc1x1NTIwNlx1NTMwNVxuICAgICAgICBsaWI6IHtcbiAgICAgICAgICAgIGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgXCIuLi9pbmRleC50c1wiKSxcbiAgICAgICAgICAgIG5hbWU6IFwiVG95RWxlbWVudFwiLFxuICAgICAgICAgICAgZmlsZU5hbWU6IFwiaW5kZXhcIixcbiAgICAgICAgICAgIGZvcm1hdHM6IFtcImVzXCJdXG4gICAgICAgIH0sXG4gICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgICAgIGV4dGVybmFsOiBbXG4gICAgICAgICAgICAgICAgXCJ2dWVcIiwgLy8gZXMgXHU2ODNDXHU1RjBGXHU3Njg0XHU4OTgxXHU4RkRCXHU4ODRDXHU1MjA2XHU1MzA1LCBcdTk2NjRcdTRFODZcdTg5ODFcdTVCODlcdTg4QzV2dWVcdTRFNEJcdTU5MTYsIFx1OEZEOFx1ODk4MVx1NUI4OVx1ODhDNVx1NTZGRVx1NjgwN1xuICAgICAgICAgICAgICAgIFwiQGZvcnRhd2Vzb21lL2ZvbnRhd2Vzb21lLXN2Zy1jb3JlXCIsXG4gICAgICAgICAgICAgICAgXCJAZm9ydGF3ZXNvbWUvZnJlZS1zb2xpZC1zdmctaWNvbnNcIixcbiAgICAgICAgICAgICAgICBcIkBmb3J0YXdlc29tZS92dWUtZm9udGF3ZXNvbWVcIixcbiAgICAgICAgICAgICAgICBcIkBwb3BwZXJqcy9jb3JlXCIsXG4gICAgICAgICAgICAgICAgXCJhc3luYy12YWxpZGF0b3JcIlxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIG91dHB1dDoge1xuICAgICAgICAgICAgICAgIGV4cG9ydHM6IFwibmFtZWRcIixcbiAgICAgICAgICAgICAgICBnbG9iYWxzOiB7XG4gICAgICAgICAgICAgICAgICAgIHZ1ZTogXCJWdWVcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm8pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFzc2V0SW5mby5uYW1lID09PSBcInN0eWxlLmNzc1wiKSByZXR1cm4gXCJpbmRleC5jc3NcIjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXRJbmZvLnR5cGUgPT09IFwiYXNzZXRcIiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgL1xcLihjc3MpJC9pLnRlc3QoYXNzZXRJbmZvLm5hbWUgYXMgc3RyaW5nKVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcInRoZW1lL1tuYW1lXS5bZXh0XVwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhc3NldEluZm8ubmFtZSBhcyBzdHJpbmc7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvLyBcdTUyMDZcdTUzMDVcbiAgICAgICAgICAgICAgICBtYW51YWxDaHVua3MoaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWRcdTY2MkZcdThERUZcdTVGODRcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKFwibm9kZV9tb2R1bGVzXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJ2ZW5kb3JcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcIi9wYWNrYWdlcy9ob29rc1wiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiaG9va3NcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcIi9wYWNrYWdlcy91dGlsc1wiKSB8fCBpZC5pbmNsdWRlcyhcInBsdWdpbi12dWU6ZXhwb3J0LWhlbHBlclwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwidXRpbHNcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZGlyTmFtZSBvZiBnZXREaXJlY3Rvcmllc1N5bmMoXCIuLi9jb21wb25lbnRzXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoYC9wYWNrYWdlcy9jb21wb25lbnRzLyR7ZGlyTmFtZX1gKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkaXJOYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KSJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVYsU0FBUyxvQkFBb0I7QUFDOVcsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsZUFBZTtBQUN4QixPQUFPLFNBQVM7QUFDaEIsU0FBUyxtQkFBbUI7QUFDNUIsU0FBUyxRQUFRLEtBQUssT0FBTyxhQUFhO0FBQzFDLE9BQU8sV0FBVztBQUVsQixPQUFPLFlBQVk7QUFSbkIsSUFBTSxtQ0FBbUM7QUFhekMsSUFBTSxTQUFTLFFBQVEsSUFBSSxhQUFhO0FBQ3hDLElBQU0sUUFBUSxRQUFRLElBQUksYUFBYTtBQUN2QyxJQUFNLFNBQVMsUUFBUSxJQUFJLGFBQWE7QUFFeEMsU0FBUyxtQkFBbUIsVUFBa0I7QUFDMUMsUUFBTSxVQUFVLFlBQVksVUFBVSxFQUFFLGVBQWUsS0FBSyxDQUFDO0FBRTdELFNBQU87QUFBQSxJQUNILE9BQU8sU0FBUyxDQUFDLFVBQVUsTUFBTSxZQUFZLENBQUM7QUFBQSxJQUM5QyxDQUFDLFVBQVUsTUFBTTtBQUFBLEVBQ3JCO0FBQ0o7QUFVQSxJQUFPLHlCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTO0FBQUEsSUFBQyxJQUFJO0FBQUEsSUFBRyxJQUFJO0FBQUEsTUFDakIsY0FBYztBQUFBLE1BQ2QsUUFBUTtBQUFBLElBQ1osQ0FBQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLRCxPQUFPO0FBQUEsTUFDSCxVQUFVO0FBQUEsUUFDTixjQUFjLENBQUMsS0FBSztBQUFBLFFBQ3BCLGVBQWU7QUFBQSxRQUNmLFFBQVE7QUFBQSxRQUNSLGFBQWE7QUFBQSxVQUNULFFBQVEsS0FBSyxVQUFVLEtBQUs7QUFBQSxVQUM1QixTQUFTLEtBQUssVUFBVSxNQUFNO0FBQUEsVUFDOUIsU0FBUyxLQUFLLFVBQVUsTUFBTTtBQUFBLFFBQ2xDO0FBQUEsTUFDSjtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ0osWUFBWTtBQUFBLFFBQ1osV0FBVztBQUFBLFFBQ1gsUUFBUSxDQUFDO0FBQUEsUUFDVCxVQUFVLENBQUM7QUFBQSxRQUNYLFVBQVUsQ0FBQztBQUFBLE1BQ2Y7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNKLFVBQVU7QUFBQSxRQUNWLE1BQU07QUFBQSxRQUNOLGlCQUFpQjtBQUFBLFFBQ2pCLGFBQWE7QUFBQSxNQUNqQjtBQUFBLElBQ0osQ0FBQztBQUFBLEVBQUM7QUFBQSxFQUNGLE9BQU87QUFBQSxJQUNILFFBQVE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU9SLGNBQWM7QUFBQTtBQUFBLElBQ2QsS0FBSztBQUFBLE1BQ0QsT0FBTyxRQUFRLGtDQUFXLGFBQWE7QUFBQSxNQUN2QyxNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsTUFDVixTQUFTLENBQUMsSUFBSTtBQUFBLElBQ2xCO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDWCxVQUFVO0FBQUEsUUFDTjtBQUFBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDSixTQUFTO0FBQUEsUUFDVCxTQUFTO0FBQUEsVUFDTCxLQUFLO0FBQUEsUUFDVDtBQUFBLFFBQ0EsZ0JBQWdCLENBQUMsY0FBYztBQUMzQixjQUFJLFVBQVUsU0FBUyxZQUFhLFFBQU87QUFDM0MsY0FDSSxVQUFVLFNBQVMsV0FDbkIsWUFBWSxLQUFLLFVBQVUsSUFBYyxHQUMzQztBQUNFLG1CQUFPO0FBQUEsVUFDWDtBQUNBLGlCQUFPLFVBQVU7QUFBQSxRQUNyQjtBQUFBO0FBQUEsUUFFQSxhQUFhLElBQUk7QUFFYixjQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDN0IsbUJBQU87QUFBQSxVQUNYO0FBQ0EsY0FBSSxHQUFHLFNBQVMsaUJBQWlCLEdBQUc7QUFDaEMsbUJBQU87QUFBQSxVQUNYO0FBQ0EsY0FBSSxHQUFHLFNBQVMsaUJBQWlCLEtBQUssR0FBRyxTQUFTLDBCQUEwQixHQUFHO0FBQzNFLG1CQUFPO0FBQUEsVUFDWDtBQUNBLHFCQUFXLFdBQVcsbUJBQW1CLGVBQWUsR0FBRztBQUN2RCxnQkFBSSxHQUFHLFNBQVMsd0JBQXdCLE9BQU8sRUFBRSxHQUFHO0FBQ2hELHFCQUFPO0FBQUEsWUFDWDtBQUFBLFVBQ0o7QUFBQSxRQUNKO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
