FROM node:22-alpine

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

COPY backend/prisma ./prisma
COPY backend/nest-cli.json ./
COPY backend/tsconfig.json ./
COPY backend/src ./src

RUN npx prisma generate && npx nest build

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
