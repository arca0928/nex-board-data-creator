# Nex-Board-Data-Creator

大阪公立大学工業高等専門学校の高専祭におけるステージイベント向けに、[Nex-Board](https://github.com/nex-board/nex-board)とステージ照明用の演出資料を作成するアプリケーション

## Features

- SvelteKit
- Svelte 5
- TypeScript
- Vite

---

## Requirements

- Node.js >= 22.18.0（推奨: 24 LTS）
- pnpm

---

## Getting Started

### Install

Nixを使う場合は、先に`nix develop`で開発シェルに入ってください。Linux用のシェルには、
Cloudflareの実行エンジン`workerd`をNixの動的リンカーで起動する設定も含めています。

```bash
pnpm install --frozen-lockfile
```

### Development

```bash
pnpm dev
```

ブラウザで

```
http://localhost:5173
```

を開きます。

---

## Available Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `pnpm dev`         | 型生成と開発サーバー起動             |
| `pnpm build`       | 型生成・本番ビルド・デプロイ出力生成 |
| `pnpm preview`     | 本番ビルドをWorkers環境で確認        |
| `pnpm check`       | 型生成と型チェック                   |
| `pnpm check:watch` | 型生成後、型チェックを監視           |
| `pnpm gen`         | Cloudflareの型定義を生成             |
| `pnpm cf-typegen`  | `pnpm gen`と同じ                     |
| `pnpm run deploy`  | 本番ビルド後、Cloudflareへデプロイ   |
| `pnpm lint`        | Lint                                 |
| `pnpm format`      | コードフォーマット                   |
| `pnpm test`        | テスト                               |

## Cloudflare CLIでビルド・デプロイする

Cloudflare CLI（`cf`）を使ってデプロイします。Workerの設定は`cloudflare.config.ts`、
ビルド方法と静的アセットのディレクトリは`wrangler.config.ts`で指定します。

### SvelteKit用にWranglerの依存と設定を残す

現在の`@sveltejs/adapter-cloudflare`はWranglerのAPIと`wrangler.jsonc`を読み込みます。
そのため、Wranglerを開発依存として残し、`wrangler.jsonc`も保持しています。
設定を変更するときは、エントリーポイント・互換日付・バインディングを
`cloudflare.config.ts`と`wrangler.jsonc`で一致させてください。アセットのディレクトリは、
`wrangler.config.ts`と`wrangler.jsonc`に同じパスを指定します。

`cf build`はSvelteKitの`vite build`を呼び出しますが、現在のアダプターではcfが必要とする
デプロイ用の出力（Build Output）を生成できません。`pnpm build`では`vite build`の後に
`cf-wrangler build`を実行し、`.cloudflare/output/v0/`へ出力します。
`pnpm preview`も、新しい設定を読む`cf-wrangler dev`で本番ビルドを起動します。

型定義は`cf workers types`で`.cloudflare/types/index.d.ts`に生成します。
開発・ビルド・型チェックの各スクリプトで生成するため、Gitには含めません。

### 認証してからデプロイする

初回はCloudflareにログインしてください。

```bash
pnpm cf auth login
pnpm run deploy
```

`pnpm run deploy`はビルド後、生成した出力を`cf deploy --prebuilt`でデプロイします。
`pnpm deploy`はpnpm自身のコマンドと重なるため、`run`を付けて実行してください。

### アップロードせずにデプロイ内容を確認する

```bash
pnpm build
pnpm cf deploy --prebuilt --dry-run
```

`--dry-run`ではWorkerをアップロードせず、デプロイ用の出力とバインディングを検証します。
コマンドの仕様は[Cloudflareの移行ガイド](https://developers.cloudflare.com/cf/wrangler/migrate/)を参照してください。
