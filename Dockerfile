FROM node:14-alpine as builder
WORKDIR /src
COPY ./package.json ./
RUN yarn install
COPY . .
RUN yarn build


# Second Stage : Setup command to run your app using lightweight node image
FROM node:14-alpine
WORKDIR /src
COPY --from=builder /api ./
EXPOSE 3001
CMD ["yarn", "start:prod"]