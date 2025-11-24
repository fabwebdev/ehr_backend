# Use Node 20 (required by some deps)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install build dependencies for SQLite and Python packages
RUN apk add --no-cache sqlite-dev openssl python3 py3-setuptools make g++ build-base

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies with specific flags to ensure native modules build correctly
RUN npm install --build-from-source --sqlite=/usr

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 8000

# Start app
CMD ["npm", "start"]