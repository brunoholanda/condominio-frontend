/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  /** Contato do controlador exibido no aviso de privacidade. */
  readonly VITE_PRIVACY_CONTACT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
