FROM node:20-bullseye

RUN apt-get update \
  && apt-get install -y --no-install-recommends tzdata python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

ENV TZ=Europe/Helsinki
WORKDIR /usr/src/app

# copy only lockfiles for caching deps
COPY package.json package-lock.json ./

# install deps into the IMAGE (this is fine, but will be overwritten by volumes unless you mount a volume)
RUN npm ci --legacy-peer-deps --include=dev

# copy source (optional for dev; compose bind-mount will override)
COPY . .

EXPOSE 8000

CMD ["npm", "run", "start:dev"]