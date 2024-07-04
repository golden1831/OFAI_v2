FROM node:20-alpine3.17 as builder
WORKDIR /app
COPY package*.json  ./
RUN npm i
COPY . .

ARG VITE_API_URL
ARG VITE_WEB3AUTH_CLIENT_ID
ARG VITE_ENV
ENV VITE_API_URL $VITE_API_URL
ENV VITE_WEB3AUTH_CLIENT_ID $VITE_WEB3AUTH_CLIENT_ID
ENV VITE_ENV $VITE_ENV

RUN npm run build

FROM nginx:1.27.0-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]