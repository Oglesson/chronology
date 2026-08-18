/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_ENDPOINT: string;
	readonly VITE_APP_CLIENTID: string;
	readonly VITE_APP_ISSUER_DOMAIN: string;
	readonly VITE_API_AUDIENCE_IDENTIFIER: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
