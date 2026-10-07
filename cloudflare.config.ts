import { bindings, defineConfig } from 'cf/config';

export default defineConfig({
	worker: {
		name: 'nexboard-creator',
		compatibilityDate: '2026-08-20',
		entrypoint: '.svelte-kit/cloudflare/_worker.js',
		workersDev: true,
		previewUrls: true,
		observability: {
			enabled: true
		},
		env: {
			ASSETS: bindings.assets()
		}
	}
});
