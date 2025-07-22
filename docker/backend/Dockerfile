# Goバックエンド用Dockerfile
FROM golang:1.24.3-alpine AS builder

# 作業ディレクトリを設定
WORKDIR /app

# 必要なパッケージをインストール
RUN apk add --no-cache git

# go.modとgo.sumをコピー
COPY go.mod go.sum* ./

# 依存関係をダウンロード
RUN go mod download

# ソースコードをコピー
COPY . .

# バイナリをビルド
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/app

# 実行用の軽量イメージ
FROM alpine:latest

# 必要なパッケージをインストール
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# ビルドしたバイナリをコピー
COPY --from=builder /app/main .

# ポート8080を公開
EXPOSE 8080

# アプリケーションを実行
CMD ["./main"] 