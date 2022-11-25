FROM node:19.1.0-alpine3.16 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
# ENV  NODE_OPTIONS "--openssl-legacy-provider"
RUN npm ci # --legacy-peer-deps
# RUN npm install react-scripts@2.1.5 -g
COPY ./src ./src
COPY ./public ./public
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]