# Use official Node.js image as a base
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Use a lightweight Node.js runtime
FROM node:18-alpine

WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app ./

# Expose port
EXPOSE 3000

# Command to run the application
CMD ["sh", "-c", "npx prisma db push && npm run start"]