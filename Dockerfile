FROM node:16-alpine

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn install --frozen-lockfile

COPY . /app

EXPOSE 4000

CMD ["yarn", "start"]
