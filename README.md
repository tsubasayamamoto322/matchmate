# MatchMate 設計書

## 概要
**MatchMate**は、サッカーチーム向けの試合出欠管理およびポジション設定アプリケーションです。
監督と選手が効率的にコミュニケーションを取り、試合の準備を円滑に進めることができます。
MatchMateアプリケーションの設計ドキュメントは[ドキュメント一覧](#ドキュメント一覧)を参照ください。

## 開発背景・体制
所属する社会人サッカーチームでの管理の不便を解消したいという思いから、エンジニア転職前の未経験時代に
Laravelで開発した[League-management(Github)](https://github.com/ryousukemizokami/League-Management)を、フルリメイクしました。
また、会社の同僚を巻き込んで3人の開発体制とし、リーダーとして設計書作成や機能定義、タスク管理を主導しました。
現在は細部のUX調整や最終的なブラッシュアップをすべて自身で行っています。本リポジトリは開発のリポジトリをフォークしたものになります。

## AIを活用した設計・開発プロセス
本プロジェクトでは、Cursor/Google Stitchを設計から実装、ドキュメント作成に至る全工程で活用しました。
1. デザイン・設計フェーズ
実装前にFigmaによるプロトタイプ設計を行い、手戻りを最小限に抑えました。
    - AIによるUI生成: Google Stitchを活用して初期UIを自動生成。Figmaへのエクスポート機能を用い、ブラッシュアップを実施しました。
    - プロトタイピング: Figma上で[画面遷移](https://www.figma.com/design/FpW75e7qIgSGYb4sy7AhcE/%E7%94%BB%E9%9D%A2%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3%E3%83%BB%E9%81%B7%E7%A7%BB?node-id=382-2907)、[DBスキーマ](https://www.figma.com/board/vW3fLwMnMpIVzhX3VzSQmx/DB%E8%A8%AD%E8%A8%88?node-id=0-1)、[APIエンドポイント](https://www.figma.com/design/FpW75e7qIgSGYb4sy7AhcE/%E7%94%BB%E9%9D%A2%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3%E3%83%BB%E9%81%B7%E7%A7%BB?node-id=382-2907)のドラフトを作成。実装前に全体の整合性を視覚化しました。
2. 実装フェーズ（Cursor Pro）
メインエディタとしてCursorを採用し、以下のプロセスで実装の高速化と精度向上を図りました。
    - 型安全な開発: Supabaseの型定義（TypeScript）に基づき、AIによるコード補完とリファクタリングを繰り返すことで、型安全性を担保した堅牢なコードを記述しました。
    - ドキュメントの逆生成: 実装完了後、ソースコードをCursorに読み込ませることで、実装の実態に即した「生きた設計書」をアウトプット。設計と実装の乖離を防いでいます。

## ドキュメント一覧

| ファイル | 説明 |
|----------|------|
| [01_システム概要.md](/docs/design/01_システム概要.md) | プロジェクト概要、技術スタック、アーキテクチャ |
| [02_機能要件.md](/docs/design/02_機能要件.md) | ユーザーロール、機能一覧、ビジネスルール |
| [03_データベース設計.md](/docs/design/03_データベース設計.md) | ER図、テーブル定義、RLS設計 |
| [04_画面設計.md](/docs/design/04_画面設計.md) | 画面一覧、画面遷移図、ワイヤーフレーム |
| [05_コンポーネント設計.md](/docs/design/05_コンポーネント設計.md) | コンポーネント構成、Props/Emits定義、Composables |
| [06_API設計.md](/docs/design/06_API設計.md) | Supabaseクエリパターン、データ操作フロー |
| [07_非機能要件.md](/docs/design/07_非機能要件.md) | パフォーマンス、セキュリティ、レスポンシブ対応 |

## 技術スタック概要

```
フロントエンド: Nuxt.js 4 + Vue 3 + TypeScript + Tailwind CSS
バックエンド: Supabase (Authentication, Database, Storage)
ホスティング: Vercel
```

## 主要機能

### 共通機能
- ユーザー登録・ログイン
- プロフィール編集
- チーム選択

### 監督機能
- チーム作成・管理
- 試合作成・編集・削除
- 選手の加入承認/却下
- **ポジション設定**（ビジュアルフィールド上でドラッグ&ドロップ）

### 選手機能
- チーム加入申請
- 出欠回答
- スケジュール確認
- ポジション確認

## アーキテクチャ図

```mermaid
graph TB
%%{init: {'theme': 'neutral'}}%%
    subgraph Client[クライアント]
        Browser[ブラウザ/モバイル]
    end

    subgraph App[Nuxt.js Application]
        Pages[Pages]
        Components[Components]
        Composables[Composables]
    end

    subgraph Supabase[Supabase]
        Auth[Authentication]
        DB[(PostgreSQL)]
        Storage[Storage]
    end

    Browser --> Pages
    Pages --> Components
    Pages --> Composables
    Components --> Composables
    Composables --> Auth
    Composables --> DB
    Composables --> Storage
```

## ディレクトリ構成

```
matchmate/
├── app/
│   ├── components/     # 再利用可能コンポーネント
│   ├── composables/    # Composition API関数
│   ├── layouts/        # レイアウト
│   ├── middleware/     # ミドルウェア
│   └── pages/          # ページコンポーネント
├── server/
│   └── api/            # サーバーサイドAPI
├── public/             # 静的ファイル
└── docs/
    └── design/         # 設計ドキュメント
```

## ポジション設定機能

MatchMateの特徴的な機能である「ポジション設定」は、以下のコンポーネントで構成されています：

```mermaid
graph TD
%%{init: {'theme': 'neutral'}}%%
    GameDetail[games/id.vue] --> PositionManager[PositionManager.vue]
    PositionManager --> FormationSelector[FormationSelector.vue]
    PositionManager --> SoccerField[SoccerField.vue]
    PositionManager --> PlayerList[PlayerList.vue]
    SoccerField --> PlayerCard[PlayerCard.vue]
    PlayerList --> PlayerCard
```

### 主な機能
- **フォーメーション選択**: 4-4-2, 4-3-3, 3-5-2, 4-2-3-1, 3-4-3
- **編集モード**: 
  - 交換モード（2選手をクリックして位置交換）
  - ドラッグモード（自由に位置調整）
- **スタメン/サブ管理**: 最大11人のスタメン配置

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2026-03-21 | 初版作成 |

