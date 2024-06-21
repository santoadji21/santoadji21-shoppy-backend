# Stage 1: Development the application
FROM node:20-alpine as development

# Create app directory inside the container
WORKDIR /usr/src/app

# Copy package.json, package-lock.json, and pnpm-lock.yaml to the container
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Copy Prisma schema and generate client
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install

# Generate Prisma Client
RUN pnpx prisma generate

# Copy the source code to the container
COPY . .

# Build the application
RUN pnpm run build

# Stage 2: Production the application
FROM node:20-alpine as production

# Arguments for the stage
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Create app directory inside the container
WORKDIR /usr/src/app

# Install openssl
RUN apk add openssl3

# Copy package.json, package-lock.json, and pnpm-lock.yaml to the container
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install only production dependencies
RUN pnpm install --prod

# Copy the Prisma Client and schema from the development stage
COPY --from=development /usr/src/app/prisma ./prisma
COPY --from=development /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Copy the build application from the development stage
COPY --from=development /usr/src/app/dist ./dist

# Copy the necessary source files
COPY --from=development /usr/src/app/node_modules ./node_modules

# Run the application
CMD ["node", "dist/main"]
