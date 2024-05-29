FROM node:20

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y ffmpeg

COPY . .

RUN yarn installation

EXPOSE 5678

CMD ["yarn", "start"]