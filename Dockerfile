# マルチステージビルドを使用
# Stage 1: 依存関係のインストール
FROM node:20-alpine AS deps
WORKDIR /app
COPY frontend/package.json ./
RUN npm install

# Stage 2: ビルド
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ .
ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=${GEMINI_API_KEY}
RUN npm run build

# Stage 3: 本番環境用（Nginx）
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Stage 4: 開発環境用
FROM node:20-alpine AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ .
EXPOSE 3000
CMD ["npm", "run", "dev"]

