# install dev deps and build
FROM node:20.13.1-alpine3.19 AS builder

WORKDIR /build/
COPY . /build/

RUN npm ci --no-audit --no-fund && \
    npm run build

# copy built app and assemble actual dist
FROM node:20.13.1-alpine3.19

RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache git>=2.43.0-r0 mysql-client>=10.11.6-r0 && \
    npm ci --no-audit --no-fund

LABEL org.opencontainers.image.authors="EDM115 <dev@edm115.dev>, EuphoriaReal <allan.maccrez@gmail.com>, yamakajump"
LABEL org.opencontainers.image.base.name="node:20.13.1-alpine3.19"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.source="https://github.com/EDM115-org/Tab-Magiques.git"
LABEL org.opencontainers.image.title="Tab Magiques"
LABEL org.opencontainers.image.url="https://github.com/EDM115-org/Tab-Magiques.git"

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV PORT 56860

WORKDIR /app/

COPY --from=builder /build/.output /app/.output

COPY README.md .
COPY LICENSE .
COPY .env .
COPY db/verif_db.mjs /app/verif_db.mjs

EXPOSE 56860

CMD ["node", "/app/verif_db.mjs", "&&", "node", "/app/.output/server/index.mjs"]

