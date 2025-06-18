FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html/offers

# Create nginx configuration
RUN echo 'server { \
    listen 3003; \
    server_name localhost; \
    location /offers { \
        alias /usr/share/nginx/html/offers; \
        try_files $uri $uri/ /offers/index.html; \
        index index.html; \
    } \
    location / { \
        return 404; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3003

CMD ["nginx", "-g", "daemon off;"] 