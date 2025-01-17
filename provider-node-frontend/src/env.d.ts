/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string
  readonly VITE_PROVIDER_HOST: string
  readonly VITE_PROVIDER_PORT: string
  readonly VITE_DEV_API_KEY: string
  readonly VITE_ANONYMOUS_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
