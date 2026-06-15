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

RUN ./node_modules/.bin/nest build

RUN ls dist/main.js && echo "BUILD SUCCESS"

EXPOSE 3001

CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && node dist/main"]
