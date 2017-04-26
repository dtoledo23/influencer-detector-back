FROM node:7
MAINTAINER toledo.diego09@gmail.com

RUN mkdir -p /usr/local/back/
WORKDIR /usr/local/back

ADD package.json .
ENV NPM_CONFIG_LOGLEVEL warn

RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "start"]

