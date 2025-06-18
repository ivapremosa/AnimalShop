FROM node:18-alpine AS builder

WORKDIR /app

# Copy and build shared package first
COPY ../shared ./shared
WORKDIR /app/shared
RUN npm install
RUN npm run build

# Build auth frontend
WORKDIR /app/auth
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/auth/dist /usr/share/nginx/html/auth

# Create nginx configuration
RUN echo 'server { \
    listen 3002; \
    server_name localhost; \
    location /auth { \
        alias /usr/share/nginx/html/auth; \
        try_files $uri $uri/ /auth/index.html; \
        index index.html; \
    } \
    location / { \
        return 404; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3002

CMD ["nginx", "-g", "daemon off;"] 