FROM node:20

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y ffmpeg

RUN wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

COPY . .

RUN yarn installation

EXPOSE 5678

CMD ["yarn", "start"]