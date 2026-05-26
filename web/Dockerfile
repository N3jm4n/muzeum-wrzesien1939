# ============================================
# Stage 1: Build the frontend
# ============================================
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files first for dependency caching
COPY package.json package-lock.json ./

RUN npm ci

# Copy source code and build
COPY . .

# Set API URL to relative path (Nginx will proxy /api to backend)
ENV VITE_API_URL=/api/v1

RUN npm run build

# ============================================
# Stage 2: Serve with Nginx
# ============================================
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend files
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
