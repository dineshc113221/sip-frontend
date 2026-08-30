ARG BASE_IMAGE=ts-docker.artifactrepo.kenvue.com/ts-docker/node:24.16.2
ARG NGINX_IMAGE=ts-docker.artifactrepo.kenvue.com/ts-docker/nginx:1.30

FROM ${BASE_IMAGE} AS builder

WORKDIR /app 

COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY index.html ./
COPY src ./src
COPY nginx.conf ./
COPY public ./public
COPY tests ./tests
COPY nginx.conf ./
COPY webpack.config.js ./
COPY vite.config.ts ./
COPY babel.config.json ./
COPY .env.dev ./
COPY .env.prod ./
COPY .env.qa ./

RUN npm install --force --ignore-scripts
 
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build:prod
RUN rm -rf node_modules


FROM ${NGINX_IMAGE} 

COPY --from=builder /app/dist /app/web
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD curl --fail --max-time 5 http://localhost || exit 1
