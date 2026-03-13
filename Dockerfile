# --- ЭТАП СБОРКИ (Builder) ---
FROM node:20-alpine AS builder
WORKDIR /app

ENV NEXT_PUBLIC_SERVER_URL=https://hardtimes-server-1.onrender.com

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# --- ЭТАП ЗАПУСКА (Runner) ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NEXT_PUBLIC_SERVER_URL=https://hardtimes-server-1.onrender.com
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]