# --- ЭТАП СБОРКИ (Builder) ---
FROM node:20-alpine AS builder
WORKDIR /app

# 1. Прописываем переменную ДО сборки (критически важно)
ENV NEXT_PUBLIC_SERVER_URL=https://hardtimes-server-1.onrender.com

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npm run build

# --- ЭТАП ЗАПУСКА (Runner) ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NEXT_PUBLIC_SERVER_URL=https://hardtimes-server-1.onrender.com
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start", "--", "-H", "0.0.0.0"]