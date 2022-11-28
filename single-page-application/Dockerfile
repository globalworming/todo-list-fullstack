FROM node:19.1.0-alpine3.16 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY ./src ./src
COPY ./public ./public
RUN npm run build

# production environment
FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]