# install dev deps and build
FROM node:20.13.0-alpine3.19 AS builder

RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache git mysql-client

WORKDIR /build/
COPY . /build/

RUN npm ci --no-audit --no-fund && \
    npm run build

# copy built app and assemble actual dist
FROM node:20.13.0-alpine3.19

LABEL org.opencontainers.image.authors="dev@edm115.dev"

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV PORT 8000

WORKDIR /app/

COPY --from=builder /build/.output /app/.output

COPY README.md .
COPY LICENSE .
COPY .env .

EXPOSE 8000

CMD ["node", ".output/server/index.mjs"]
