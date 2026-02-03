---
name: MatchMate 設計書作成
overview: MatchMateアプリケーションの現在の実装を元に、詳細設計レベルの設計書を作成します。システム全体の概要、機能仕様、データベース設計、コンポーネント構成、画面遷移図などをMermaid図を活用して視覚的に文書化します。
todos: []
isProject: false
---

# MatchMate 設計書作成計画

## 概要

MatchMateは、サッカーチーム向けの試合出欠管理およびポジション設定アプリケーションです。監督がチームを作成し、選手が加入申請を行い、試合のスケジュール管理、出欠確認、ポジション配置を行うことができます。

## 設計書の構成

### 1. システム概要

- プロジェクト概要
- 技術スタック
- アーキテクチャ概要図（Mermaid）

### 2. 機能要件

- ユーザーロール（監督・選手）別の機能一覧
- 各機能の詳細仕様

### 3. データベース設計

- ER図（Mermaid）
- テーブル定義
  - users（ユーザー）
  - teams（チーム）
  - team_members（チームメンバー）
  - games（試合）
  - attendances（出欠）
  - positions（ポジションマスタ）

### 4. 画面設計

- 画面一覧
- 画面遷移図（Mermaid）
- 各画面の構成要素

### 5. コンポーネント設計

- コンポーネント構成図（Mermaid）
- 主要コンポーネントの責務
  - PositionManager.vue
  - SoccerField.vue
  - PlayerCard.vue
  - FormationSelector.vue
  - PlayerList.vue

### 6. Composables設計

- useUserRole
- useTeamSession
- useFormations
- useSupabaseClient

### 7. フォーメーション機能の詳細設計

- フォーメーション定義
- ポジション配置ロジック
- ドラッグ&ドロップ処理フロー（シーケンス図）
- 選手交換モードの仕様

### 8. 認証・認可設計

- 認証フロー（Supabase Auth）
- ロール制御
- セッション管理

### 9. API設計

- Supabaseクエリパターン
- 主要なデータ操作フロー

### 10. 非機能要件

- レスポンシブデザイン対応
- パフォーマンス考慮事項
- エラーハンドリング

## 成果物

`docs/design/` フォルダ配下に以下のファイルを作成：

- `01_システム概要.md`
- `02_機能要件.md`
- `03_データベース設計.md`
- `04_画面設計.md`
- `05_コンポーネント設計.md`
- `06_API設計.md`
- `07_非機能要件.md`
- `README.md`（設計書の目次）

各ファイルには適切なMermaid図を含め、視覚的に理解しやすい設計書とします。