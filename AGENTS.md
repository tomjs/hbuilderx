# AGENTS.md

pnpm workspace monorepo (`@tomjs/hbuilderx`): TypeScript tooling for HBuilderX plugin development. Three published packages + five example plugins. No test runner — verify with typecheck + lint.

## Layout

- `packages/hbuilderx` — `@tomjs/hbuilderx`. Canonical `hbuilderx` module types (`hbuilderx.d.ts`, exported as `@tomjs/hbuilderx/types`) + small runtime helpers (`setContext`/`getContext`/`initExtension`/`isAlphaVersion` in `src/`). `"type": "commonjs"`, builds cjs+esm via tsdown.
- `packages/hbuilderx-cli` — `@tomjs/hbuilderx-cli`, `hx-cli` bin. Generates a project-specific `hbuilderx.d.ts` from `package.json` `contributes` (`src/watch.ts`), packs plugin `.zip` (`--pack`). `"type": "module"`.
- `packages/vite` — `@tomjs/vite-plugin-hbuilderx`, vite plugin for vue/react webviews. `"type": "module"`.
- `examples/ext-*` — example plugins, all `"type": "commonjs"`: `ext-simple`/`ext-web` use tsdown; `ext-web-react`/`ext-web-vue`/`ext-web-vue-multiple` use vite.

## Commands (run inside the package/example dir)

- Install: `pnpm install` at root (pnpm@10.27.0 pinned in `packageManager`).
- Root `pnpm build` → `pnpm -r --stream --filter=@tomjs/* build`, builds only the three `packages/*`, **not** the examples.
- Build/dev one target: `pnpm build` or `pnpm dev` (tsdown `--watch`, `vite`, or `hx-cli --watch`) in its own directory.
- Lint: `pnpm lint` (eslint `--fix`). Commits are gated by `simple-git-hooks`: lint-staged auto-fixes + commitlint (`@tomjs/commitlint`), so use conventional messages (`feat:`, `fix:`, `chore: release ...`).
- Typecheck (no npm script): `pnpm exec tsc --noEmit -p tsconfig.json` per package.

## Critical gotchas

- **tsdown config files must stay `.mts` in `type: commonjs` packages** (`packages/hbuilderx` + all examples): tsdown 0.18 can't load a `.ts` config using ESM `import` under `"type": "commonjs"` (`Cannot use import statement outside a module`). They were renamed `tsdown.config.ts` → `tsdown.config.mts`; don't rename back. Read `package.json` in the config via `createRequire(import.meta.url)` (ESM can't `import` JSON without an attribute). The two `type: module` packages keep `tsdown.config.ts`.
- **Build `packages/hbuilderx` before working in examples**: examples import `@tomjs/hbuilderx` (runtime + `@tomjs/hbuilderx/types`) from the workspace; without its `dist/`, typecheck/imports fail. (README documents this prerequisite.)
- **`examples/*/hbuilderx.d.ts` is auto-generated** by `hx-cli --watch` from `package.json` `contributes` (`packages/hbuilderx-cli/src/watch.ts`). Don't hand-edit it — it gets overwritten. Full API types come from `@tomjs/hbuilderx/types` via `/// <reference types="@tomjs/hbuilderx/types" />` in `src/env.d.ts`.
- **The API d.ts to edit is `packages/hbuilderx/hbuilderx.d.ts`** — a superset of the official HBuilderX d.ts (`/Applications/HBuilderX.app/Contents/HBuilderX/plugins/hbuilderx-language-services/builtin-dts/common/extension_js.d.ts`). Add missing API types there.
- **`ts/no-misused-new` lint rule**: interfaces can't carry construct signatures. For `new hx.X()` APIs, declare `export class X { constructor(); ... }` in the d.ts (already done for `TextEdit`/`WorkspaceEdit`/`EventEmitter`).
- HBuilderX plugins run on Node v16.17.0 CommonJS — keep example/plugin `"type": "commonjs"` with CJS `main` output.

## Webview client typing

`@tomjs/hbuilderx/client` (`client.d.ts`) declares the browser-side `window.hbuilderx` global (`postMessage`/`onDidReceiveMessage`/`dispatchMessage`) for vue/react webview apps — reference it via `/// <reference types="@tomjs/hbuilderx/client" />` in the webview project's d.ts.
