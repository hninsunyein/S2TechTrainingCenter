FROM node:22-alpine

WORKDIR /app

# Copy workspace root manifests
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install ALL dependencies (including devDependencies for build tools)
RUN npm install

# Copy backend source
COPY backend/ ./backend/

# Build (prisma generate + nest build)
RUN npm run build --workspace=backend

EXPOSE 3001

CMD ["npm", "run", "start", "--workspace=backend"]
