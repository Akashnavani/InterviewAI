# Stage 1: Build the React Frontend
FROM node:18 AS frontend-builder
WORKDIR /app/Frontend
COPY Frontend/package*.json ./
RUN npm install
COPY Frontend/ ./
RUN npm run build

# Stage 2: Build and run the Node Backend
FROM node:18
WORKDIR /app/Backend

# Copy backend package files and install dependencies
COPY Backend/package*.json ./
RUN npm install

# Copy backend source code
COPY Backend/ ./

# Copy the built frontend from Stage 1 into the container
# Your app.js expects the frontend to be at ../../Frontend/dist
COPY --from=frontend-builder /app/Frontend/dist /app/Frontend/dist

EXPOSE 3000
CMD ["node", "server.js"]
