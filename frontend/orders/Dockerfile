FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html/orders

# Create nginx configuration
RUN echo 'server { \
    listen 3004; \
    server_name localhost; \
    location /orders { \
        alias /usr/share/nginx/html/orders; \
        try_files $uri $uri/ /orders/index.html; \
        index index.html; \
    } \
    location / { \
        return 404; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3004

CMD ["nginx", "-g", "daemon off;"] 