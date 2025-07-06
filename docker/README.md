# PresentationManager Docker環境

このディレクトリには、PresentationManagerアプリケーションをDockerコンテナで実行するためのファイルが含まれています。

## 構成

- **MySQL 8.0**: データベースサーバー
- **Go Backend**: APIサーバー（ポート8080）
- **Next.js Frontend**: Webアプリケーション（ポート3000）

## セットアップ手順

### 1. 環境変数の設定

プロジェクトルートで`.env`ファイルを作成し、`env.example`をコピーして適切な値を設定してください：

```bash
cp env.example .env
```

`.env`ファイルを編集して、以下の値を設定してください：
- `MYSQL_ROOT_PASSWORD`: MySQLのrootパスワード
- `MYSQL_PASSWORD`: アプリケーション用ユーザーのパスワード

### 2. Docker Composeで起動

```bash
# すべてのサービスを起動
docker-compose up -d

# ログを確認
docker-compose logs -f

# 特定のサービスのログを確認
docker-compose logs -f backend
docker-compose logs -f ui
docker-compose logs -f mysql
```

### 3. アプリケーションへのアクセス

- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:8080
- **MySQL**: localhost:3306

## 開発用コマンド

### サービスの停止
```bash
docker-compose down
```

### データベースのリセット
```bash
# ボリュームを削除してデータベースをリセット
docker-compose down -v
docker-compose up -d
```

### 個別のサービスを再ビルド
```bash
# バックエンドのみ再ビルド
docker-compose build backend
docker-compose up -d backend

# フロントエンドのみ再ビルド
docker-compose build ui
docker-compose up -d ui
```

### コンテナ内でコマンドを実行
```bash
# バックエンドコンテナ内でシェルを起動
docker-compose exec backend sh

# MySQLコンテナ内でMySQLに接続
docker-compose exec mysql mysql -u root -p
```

## トラブルシューティング

### ポートが既に使用されている場合
`.env`ファイルでポートを変更するか、既存のサービスを停止してください。

### データベース接続エラー
1. MySQLコンテナが正常に起動しているか確認
2. 環境変数が正しく設定されているか確認
3. ネットワークが正しく設定されているか確認

### ビルドエラー
1. Dockerfileのパスが正しいか確認
2. 必要なファイルが存在するか確認
3. 依存関係が正しくインストールされているか確認

## 本番環境での注意事項

- 本番環境では、強力なパスワードを使用してください
- データベースのバックアップを定期的に実行してください
- SSL/TLS証明書を設定してください
- ファイアウォールを適切に設定してください 