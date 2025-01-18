import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import * as path from "node:path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd());
  return {
    base: './',
    plugins: [
      // Resolving paths as defined in tsconfig.shared.json
      tsconfigPaths(),
      nodePolyfills({
        exclude: [
          'domain' // Excludes the polyfill for `http` and `node:http`.
        ]
      }),
      vue({
        template: { transformAssetUrls }
      }),
      quasar({
        sassVariables: path.resolve(__dirname, 'src/assets/quasar-variables.sass')
      })
    ],
    server: {
      port: 8080
    },
    preview: {
      port: 8080
    }
  };
});
