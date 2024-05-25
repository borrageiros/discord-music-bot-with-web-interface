FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm installation

EXPOSE 5678

CMD ["npm", "start"]