import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

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
        sassVariables: 'src/assets/quasar-variables.sass'
      })
    ],
    server: {
      port: 8080
    },
    preview: {
      port: 8080
    },/*

    define: {
      VITE_PROVIDER_HOST: JSON.stringify(env.VITE_PROVIDER_HOST || 'localhost'),
      VITE_PROVIDER_PORT: JSON.stringify(env.VITE_PROVIDER_PORT || ''),
      VITE_DEV_API_KEY: JSON.stringify(env.VITE_DEV_API_KEY || ''),
      VITE_ANONYMOUS_MODE: JSON.stringify(env.VITE_ANONYMOUS_MODE || '')
    }*/
  };
});
