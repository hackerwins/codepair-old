FROM node:16

WORKDIR /app

ADD package.json .
ADD package-lock.json .

RUN ["npm", "install"]

ADD . .

CMD ["npm", "run", "start"]
