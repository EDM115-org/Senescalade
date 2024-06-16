FROM node:20.14.0-alpine3.19

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

COPY . /app/

RUN apk update && \
  apk upgrade --no-cache && \
  apk add --no-cache git>=2.43.0-r0 mysql-client>=10.11.6-r0 && \
  npm ci --no-audit --no-fund && \
  npm run build

EXPOSE 56860

CMD ["/bin/bash", "start.sh"]
