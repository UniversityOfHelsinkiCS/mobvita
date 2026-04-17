# mobvita
Revita frontend v2


# Setup development

Install Node.js (version 22 or newer), Docker and docker-compose

Run `npm ci`

Copy `.env.example` to `.env` and set at least `REVITA_URL`.

Run `npm run dev` or `docker-compose up` whichever you prefer (with newer version of Docker `docker compose up`)

Open localhost:8000 on your web browser

## Frontend bundler modes

Development mode now uses Vite through the Express server:

- `npm run start:dev`

Build commands:

- `npm run build`

The production build uses Vite manual chunk splitting to keep the main bundle smaller.

## Docker local notes

If you hit missing-module errors after dependency changes (for example `Cannot find module 'vite'`), recreate local volumes:

- `docker compose -f docker-compose-local.yml down -v`
- `docker compose -f docker-compose-local.yml up --build --force-recreate`

If HMR websocket reconnects keep failing in Docker, restart the local stack so the latest Vite server config is applied:

- `docker compose -f docker-compose-local.yml down -v`
- `docker compose -f docker-compose-local.yml up --build --force-recreate`

# Testing

Open app with docker and then run tests:

Graphic interface: `npm run cypress:open`

Command line: `npm run cypress:run`

# Staging deployment will happen automatically from master branch
- Production deployment happens automatically from releases

# HY Software engineering 2023

[Product backlog](https://github.com/UniversityOfHelsinkiCS/mobvita/projects/3)

[Current sprint backlog](https://github.com/UniversityOfHelsinkiCS/mobvita/projects/10)

[Working hours](https://docs.google.com/spreadsheets/d/1pFwN3QlpFcmz6TS2mHt-5RtRQFR7_kwSuSugccWkhJU/edit#gid=0)

[Definition of done](https://docs.google.com/document/d/1ynr_0eklP14B45DwyoTHullfuFfQAWloqL8T1WwjoKk/edit)
