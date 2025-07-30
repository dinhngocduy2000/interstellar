# Stage 1: Base image for installing dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Build the Next.js application
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production image
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only necessary files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Expose the port Next.js runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]