/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string
  readonly VITE_PROVIDER_NODE_HOST: string
  readonly VITE_PROVIDER_NODE_PORT: string
  readonly VITE_DEV_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
