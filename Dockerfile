FROM node:20.14.0-alpine3.19

LABEL org.opencontainers.image.authors="EDM115 <dev@edm115.dev>, EuphoriaReal <allan.maccrez@gmail.com>, yamakajump <corentin.batard2003@gmail.com>"
LABEL org.opencontainers.image.base.name="node:20.14.0-alpine3.19"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.source="https://github.com/EDM115-org/Tab-Magiques.git"
LABEL org.opencontainers.image.title="Tab Magiques"
LABEL org.opencontainers.image.url="https://github.com/EDM115-org/Tab-Magiques.git"

ENV NODE_ENV=development
ENV PORT 56860

WORKDIR /app/

COPY . /app/

RUN apk update && \
  apk upgrade --no-cache && \
  apk add --no-cache bash>=5.2.21-r0 git>=2.43.0-r0 mysql-client>=10.11.6-r0 && \
  npm i -g rimraf && \
  npm ci --no-audit --no-fund && \
  npm run build

EXPOSE 56860
ENV NODE_ENV=production

CMD ["/bin/bash", "start.sh"]
