# PresentationManager システム構成図

## システム概要
PresentationManagerは、会議のプレゼンテーション管理と自動録画機能を提供するWebアプリケーションです。

## アーキテクチャ構成

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PresentationManager                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────┐  │
│  │   Frontend UI   │    │   Backend API   │    │     Meeting Bot         │  │
│  │   (Next.js)     │    │   (Go/Gin)      │    │   (TypeScript/          │  │
│  │   Port: 3000    │◄──►│   Port: 8080    │◄──►│    Playwright)          │  │
│  │                 │    │                 │    │                         │  │
│  │ • React 19      │    │ • RESTful API   │    │ • Google Meet           │  │
│  │ • Chakra UI     │    │ • JWT Auth      │    │   自動参加              │  │
│  │ • TypeScript    │    │ • MySQL         │    │ • 画面録画              │  │
│  │ • Zustand       │    │ • Clean Arch    │    │ • 音声録音              │  │
│  └─────────────────┘    └─────────────────┘    └─────────────────────────┘  │
│           │                       │                           │              │
│           │                       │                           │              │
│           ▼                       ▼                           ▼              │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────┐  │
│  │   Keycloak      │    │     MySQL       │    │     File System         │  │
│  │   (Auth)        │    │   (Database)    │    │   (Recordings)          │  │
│  │   Port: 8090    │    │   Port: 3306    │    │                         │  │
│  │                 │    │                 │    │ • output.webm           │  │
│  │ • OAuth/SSO     │    │ • Presentations │    │ • audio.wav             │  │
│  │ • User Mgmt     │    │ • Users         │    │ • 録画ファイル          │  │
│  │ • JWT Tokens    │    │ • Teams         │    │                         │  │
│  └─────────────────┘    └─────────────────┘    └─────────────────────────┘  │
│                                   │                           │              │
│                                   │                           │              │
│                                   ▼                           ▼              │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────┐  │
│  │   Redis/RabbitMQ│    │     Slack       │    │     Notification        │  │
│  │   (Queue)       │    │   (Webhook)     │    │     System              │  │
│  │   Port: 6379    │    │   (Future)      │    │   (Future)              │  │
│  │                 │    │                 │    │                         │  │
│  │ • 非同期タスク   │    │ • 会議通知      │    │ • 録画完了通知          │  │
│  │ • 録画キュー     │    │ • 更新通知      │    │ • エラー通知            │  │
│  │ • ジョブ管理     │    │ • チーム通知    │    │ • システム通知          │  │
│  └─────────────────┘    └─────────────────┘    └─────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## コンポーネント詳細

### 1. Frontend UI (Next.js)
- **技術スタック**: React 19, Next.js 15, TypeScript, Chakra UI
- **状態管理**: Zustand
- **主要機能**:
  - ユーザー認証・管理
  - プレゼンテーション管理
  - チーム管理
  - 管理者機能

### 2. Backend API (Go/Gin)
- **技術スタック**: Go, Gin Framework, MySQL
- **アーキテクチャ**: Clean Architecture
- **主要機能**:
  - RESTful API (v1)
  - JWT認証
  - データベース操作
  - ビジネスロジック
  - 非同期タスク管理 (将来)
  - Slack通知連携 (将来)

#### Backend構造
```
backend/
├── cmd/app/main.go          # エントリーポイント
├── internal/
│   ├── domain/              # ドメインモデル
│   │   ├── presentation.go
│   │   ├── team.go
│   │   └── user.go
│   ├── handler/             # HTTPハンドラー
│   │   ├── presentation.go
│   │   ├── team.go
│   │   └── user.go
│   ├── service/             # ビジネスロジック
│   │   ├── presentation.go
│   │   ├── team.go
│   │   └── user.go
│   ├── repository/          # データアクセス
│   │   ├── model.go
│   │   └── mysql/
│   │       ├── presentation.go
│   │       ├── team.go
│   │       └── user.go
│   ├── middleware/          # ミドルウェア
│   │   └── auth/jwt.go
│   └── infra/              # インフラ層
│       └── database.go
```

### 3. Meeting Bot (TypeScript/Playwright)
- **技術スタック**: TypeScript, Playwright, FFmpeg
- **主要機能**:
  - Google Meet自動参加
  - 画面録画 (WebM形式)
  - 音声録音 (WAV形式)
  - 自動操作 (マイク・カメラ制御)

### 4. Keycloak (認証)
- **機能**: OAuth/SSO認証、ユーザー管理、JWTトークン発行
- **カスタマイズ**: ログインテーマ

### 5. MySQL (データベース)
- **スキーマ**:
  - `presentations`: プレゼンテーション情報
  - `users`: ユーザー情報
  - `teams`: チーム情報
  - `team_members`: チームメンバー関係
  - `recording_tasks`: 録画タスク管理 (将来)
  - `notifications`: 通知履歴 (将来)

### 6. Redis/RabbitMQ (キューシステム) - 将来
- **機能**: 非同期タスク管理、録画ジョブキュー
- **用途**: Meeting Botの非同期起動、タスク状態管理

### 7. Slack (通知システム) - 将来
- **機能**: Webhook連携、リアルタイム通知
- **用途**: 会議通知、録画完了通知、システム通知

## API エンドポイント

### Users
- `POST /api/v1/users` - ユーザー作成
- `GET /api/v1/users` - 全ユーザー取得
- `GET /api/v1/users/:id` - ユーザー取得
- `GET /api/v1/users/teams/:teamId` - チームユーザー取得
- `PUT /api/v1/users` - ユーザー更新
- `DELETE /api/v1/users/:id` - ユーザー削除

### Presentations
- `POST /api/v1/presentations` - プレゼンテーション作成
- `GET /api/v1/presentations` - プレゼンテーション取得
- `GET /api/v1/presentations/teams/:teamId` - チームプレゼンテーション取得
- `GET /api/v1/presentations/users/:userId` - ユーザープレゼンテーション取得
- `PUT /api/v1/presentations/team` - チーム更新
- `PUT /api/v1/presentations/assignee` - 担当者更新
- `PUT /api/v1/presentations/contents` - 内容更新
- `DELETE /api/v1/presentations/:id` - プレゼンテーション削除

### Teams
- `POST /api/v1/teams` - チーム作成
- `POST /api/v1/teams/members` - メンバー追加
- `GET /api/v1/teams` - チーム取得
- `GET /api/v1/teams/:id` - チーム詳細取得
- `PUT /api/v1/teams` - チーム更新
- `DELETE /api/v1/teams/members/:id` - メンバー削除
- `DELETE /api/v1/teams/:id` - チーム削除

### Recording Tasks (将来)
- `POST /api/v1/recordings` - 録画タスク作成
- `GET /api/v1/recordings` - 録画タスク一覧
- `GET /api/v1/recordings/:id` - 録画タスク詳細
- `PUT /api/v1/recordings/:id/status` - 録画状態更新
- `DELETE /api/v1/recordings/:id` - 録画タスク削除

## データフロー

### 1. ユーザー認証フロー
```
User → Frontend → Keycloak → JWT Token → Backend API
```

### 2. プレゼンテーション管理フロー
```
Frontend → Backend API → MySQL → Response
```

### 3. 会議録画フロー
```
Meeting Bot → Google Meet → 録画開始 → ファイル保存
```

### 4. 非同期録画フロー (将来)
```
Frontend → Backend API → キューシステム → Meeting Bot → 録画実行 → 結果通知
```

### 5. Slack通知フロー (将来)
```
Backend API → Slack Webhook → Slack通知 → ユーザー
```

## 開発環境

### Docker Compose構成
- **Keycloak**: 認証サービス
- **MySQL**: データベース
- **Backend**: Go APIサーバー
- **UI**: Next.jsフロントエンド
- **Redis/RabbitMQ**: キューシステム (将来)
- **Slack**: 通知サービス (将来)

### 環境変数
- データベース接続情報
- Keycloak設定
- API URL設定
- Slack Webhook URL (将来)
- キューシステム設定 (将来)

## 今後の拡張予定

### 完成予想機能
1. **録画ファイル管理**
   - 録画ファイルのアップロード/ダウンロード
   - 録画履歴の管理
   - 録画品質設定

2. **リアルタイム機能**
   - WebSocket接続
   - リアルタイム通知
   - ライブ会議状況

3. **高度な認証**
   - 多要素認証 (MFA)
   - ロールベースアクセス制御 (RBAC)
   - SSO連携

4. **分析・レポート機能**
   - 会議統計
   - プレゼンテーション分析
   - ユーザー活動レポート

5. **モバイル対応**
   - レスポンシブデザイン
   - PWA対応
   - モバイルアプリ

6. **統合機能**
   - カレンダー連携
   - メール通知
   - 外部ツール連携

7. **非同期Meeting Bot制御**
   - Backendからの非同期起動
   - キューシステム (Redis/RabbitMQ)
   - 録画タスク管理
   - 録画状況監視

8. **Slack通知システム**
   - 会議開始/終了通知
   - 録画完了通知
   - プレゼンテーション更新通知
   - チームメンバー変更通知
   - Slack Webhook連携 