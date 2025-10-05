FROM node:20-alpine

# Install dependencies required by Prisma
RUN apk add --no-cache bash openssl libstdc++ libc6-compat

WORKDIR /app

# Copy files needed to install and run
COPY package*.json ./
COPY prisma ./prisma
RUN npm install

# Copy the rest of the code
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript → JavaScript
RUN npx prisma generate
RUN npm run build

EXPOSE 4000

# Reset database and start app
CMD sh -c "npx prisma migrate reset --force && node dist/server.js"
