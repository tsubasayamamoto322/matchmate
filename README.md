## スポーツのリーグ戦などの出欠管理のアプリ

### 開発手法
- バージョン管理 Git/Github
- DB Supabase
- サーバー S3+Lambda
- Nuxt.js

### 必要な機能
- 監督、選手がユーザーとして登録できる
- 監督がチームを作成できる
- 選手はチームへの加入依頼を投げれる
- 監督は選手の加入依頼を承認してチームに加入させる
- 監督が試合のスケジュールを作成、管理できる。出欠確認。
- 選手は試合の出欠確認に参加可否を回答する。
- 監督は参加可能な選手の中でポジションを決定する。

### 画面一覧
#### 共通
- トップページ
- ログインページ
- 新規登録画面
- パスワード再発行画面

#### 監督
- 作成済チーム選択画面
  - 新規チーム作成画面
- 監督トップページ
  - 監督詳細情報画面
  - チーム詳細情報ページ
    - チーム情報設定
  - 所属選手一覧
    - 選手詳細情報
  - 試合スケジュール一覧
    - 試合作成画面
      - 相手もシステム登録済
      - 相手がシステム未登録
    - 試合詳細（選手の試合の出欠回答状況が見れる）
      - 試合の結果入力画面

#### 選手
- 加入済チーム選択画面
- 新規加入チーム選択画面
- 選手トップページ
  - 試合スケジュール一覧（各試合の出欠を回答する）
    - 試合詳細（他選手の試合の出欠回答状況が見れる）
  - プロフィール情報
    - プロフィール設定
  - チーム詳細情報ページ


# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

### 1. 依存関係のインストール

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
