FROM node:19.1.0-alpine3.16 as dependencies
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci

FROM node:19.1.0-alpine3.16 as build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package.json ./package.json
COPY --from=dependencies /app/package-lock.json ./package-lock.json
COPY ./src ./src
COPY ./public ./public
RUN npm run build

# Production image, copy all the files and run next
FROM node:19.1.0-alpine3.16 AS runner
WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public
COPY --from=dependencies /app/package.json ./package.json
COPY --from=dependencies /app/package-lock.json ./package-lock.json
RUN npm install -g serve

CMD serve -s -n ./build -l $PORT
