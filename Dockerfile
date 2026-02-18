FROM oven/bun:1 AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build


FROM docker.angie.software/angie:minimal
RUN rm -f /etc/angie/http.d/*.conf
COPY angie.conf /etc/angie/http.d/default.conf
COPY --from=builder /app/dist /usr/share/angie/html
