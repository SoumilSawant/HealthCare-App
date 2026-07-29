/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FRAPPE_URL?: string;
  readonly VITE_FRAPPE_API_TOKEN?: string;
  readonly VITE_CONSENT_VERSION?: string;
  readonly VITE_ADMIN_ROLES?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
