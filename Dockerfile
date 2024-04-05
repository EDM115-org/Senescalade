##########################
# install dev deps and build
FROM node:20.11.1-alpine3.19 AS builder

RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache git mysql-client && \
    npm i -g clean-modules@3.0.4

WORKDIR /app/
ADD /senescalade/package.json .
ADD /senescalade/package-lock.json .

RUN npm ci --no-audit --no-fund
ADD /senescalade/ .
RUN npm run build

##########################
# copy built app and assemble actual dist
FROM node:20.11.1-alpine3.19

LABEL org.opencontainers.image.authors="dev@edm115.dev"

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV PORT 8000

WORKDIR /app/

COPY --from=builder /app/.output /app/.output

ADD README.md .
ADD LICENSE .
ADD .env .

EXPOSE 8000

CMD ["node", "--max-http-header-size", "64000", ".output/server/index.mjs"]
