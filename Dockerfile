FROM node:18
WORKDIR /app

# Copy the Backend package files and install dependencies
COPY Backend/package*.json ./
RUN npm install

# Copy the rest of the Backend code
COPY Backend/ ./

EXPOSE 3000
CMD ["node", "server.js"]
