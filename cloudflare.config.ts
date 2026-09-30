import { bindings, defineConfig } from "cf/config";

/**
 * This migration needs manual work. Resolve every TODO in this file, then remove the error below.
 */
/**
 * TODO(@cloudflare): cf migrate: The generated configuration was written, but `cf` could not be installed automatically. Install `cf@latest` as a dev dependency with your package manager before using it. Installation failed: ✓ Lockfile passes supply-chain policies (verified 2m ago)
Progress: resolved 1, reused 0, downloaded 0, added 0
Progress: resolved 510, reused 351, downloaded 0, added 0
Packages: +7
+++++++
Progress: resolved 510, reused 351, downloaded 0, added 7, done

devDependencies:
+ cf 1.0.0-beta.5

[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: workerd@1.20260926.1

Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.

 */
throw new Error("Migration incomplete. Resolve every cf migrate TODO in `cloudflare.config.ts`.");

export default defineConfig({
	worker: {
		name: "nexboard-creator",
		compatibilityDate: "2026-08-20",
		entrypoint: ".svelte-kit/cloudflare/_worker.js",
		workersDev: true,
		previewUrls: true,
		observability: {
			enabled: true,
		},
		env: {
			ASSETS: bindings.assets(),
		},
	},
});
