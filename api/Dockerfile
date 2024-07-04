FROM node:20-alpine3.17

RUN apk --update add postgresql-client
RUN apk add build-base
RUN apk add python3
RUN apk add --no-cache ffmpeg
RUN npm install -g node-gyp

ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

WORKDIR /app

COPY package*.json  ./

RUN npm i

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]