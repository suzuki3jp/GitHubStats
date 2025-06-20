FROM node:20-alpine

# 必要なパッケージのインストール（pnpm, vercel CLI）
RUN npm install -g pnpm vercel

WORKDIR /app

# 依存関係ファイルのみを先にコピーしてキャッシュを活用
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# アプリケーション本体をコピー
COPY . .

# デフォルトコマンドはdocker-composeで上書きするのでここでは指定しない
CMD ["sh"]