FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache python3 make g++
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
ENV PORT=8080
EXPOSE 8080
CMD ["pnpm", "start"]
