FROM node:18-alpine as builder
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev > /dev/null 2>&1
WORKDIR /opt/
COPY ./package.json ./yarn.lock ./
ENV PATH /opt/node_modules/.bin:$PATH
RUN yarn config set network-timeout 600000 -g && yarn install
WORKDIR /opt/app
COPY ./ .
RUN npx prisma generate
RUN yarn build

FROM node:18-alpine
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev > /dev/null 2>&1
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /opt/app
COPY ./package.json ./yarn.lock ./
RUN yarn config set network-timeout 600000 -g && yarn install --production
COPY --from=builder /opt/app/dist ./dist
COPY --from=builder /opt/app/prisma /opt/app/prisma
RUN npx prisma generate
EXPOSE 3000
CMD ["yarn", "start"]
