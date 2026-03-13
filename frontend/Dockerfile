# Use Node.js for Vite app
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Run the dev server on 0.0.0.0 to expose it outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
