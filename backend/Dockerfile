FROM node:22-alpine

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

COPY backend/prisma ./prisma
COPY backend/nest-cli.json ./
COPY backend/tsconfig.json ./
COPY backend/tsconfig.build.json ./
COPY backend/src ./src

RUN ./node_modules/.bin/prisma generate

RUN echo "=== src contents ===" && ls -la src/

RUN ./node_modules/.bin/tsc --version

RUN ./node_modules/.bin/tsc -p tsconfig.build.json --noIncremental --listEmittedFiles 2>&1

RUN echo "=== dist contents ===" && ls -la dist/ 2>&1 || echo "dist/ NOT CREATED"

RUN ls dist/main.js && echo "BUILD SUCCESS"

EXPOSE 3001

CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && node dist/main"]
