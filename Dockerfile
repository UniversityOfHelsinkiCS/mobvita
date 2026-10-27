FROM node:26-bookworm

ENV TZ=Europe/Helsinki
WORKDIR /usr/src/app

ARG BASE_PATH
ENV BASE_PATH=$BASE_PATH

ARG COMMIT_HASH
ENV COMMIT_HASH=$COMMIT_HASH

ARG REVITA_URL
ENV REVITA_URL=$REVITA_URL

ARG ENVIRONMENT
ENV ENVIRONMENT=$ENVIRONMENT

# copy only lockfiles for caching deps
COPY package.json package-lock.json ./

# install deps into the IMAGE (this is fine, but will be overwritten by volumes unless you mount a volume)
RUN npm ci --include=dev

# copy source and build frontend assets so dist exists in pushed images
COPY . .
RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "start:prod"]