# Base image
FROM node:18-alpine AS base

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy all source files
COPY . .

# Build the app
RUN npm run build

# Start the app in production
EXPOSE 3000

ENV NODE_ENV=production

# Copy production .env
COPY .env.production .env

CMD ["npm", "start"]
