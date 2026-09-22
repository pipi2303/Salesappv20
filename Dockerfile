# ==========================================
# Sales CRM - Build Stage
# ==========================================
FROM node:24-alpine AS builder

WORKDIR /app

# Copy dependency files first for Docker cache
COPY package*.json ./

RUN npm ci

# Copy application source
COPY . .

# Production build
RUN npm run build


# ==========================================
# Sales CRM - Production Stage
# ==========================================
FROM nginx:alpine

# Custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy Vite production build
COPY --from=builder /app/dist /usr/share/nginx/html

# HTTP
EXPOSE 80

HEALTHCHECK --interval=30s \
            --timeout=5s \
            --start-period=10s \
            --retries=3 \
            CMD wget --no-verbose \
                 --tries=1 \
                 --spider \
                 http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]