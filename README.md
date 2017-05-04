# Influencer Detector
Influencer Detector is a system designed with the purpose of minning Facebook pages info and analyzing their relations in order to calculate influence levels within certain category over a predefined graph.

![alt text](https://github.com/dtoledo23/influencer-detector-front/blob/master/src/assets/img/Arquitectura.png?raw=true Influencer Detector Architecture)

- [influencer-detector-front](https://github.com/dtoledo23/influencer-detector-front)
- [influencer-detector-back](https://github.com/dtoledo23/influencer-detector-back)
- [influencer-detector-crawler](https://github.com/dtoledo23/influencer-detector-crawler)
- [influencer-detector-analytics](https://github.com/dtoledo23/influencer-detector-analytics)

### About us
We developed Influencer Detector as a school project in the Advanced Databases course. The team:

- Monserrat Genereux
- Victor Garcia
- Diego Toledo

# influencer-detector-back
System integration module. This Node app is in charge of calling all the services available (Cassandra, Crawler, Spark Job analytics and FB Graph API) in the system and provides an easy interface for interaction with the frontend.

## Requirements
- Node v7
- Cassandra 3.0
- Spark JobServer

## How to run locally
1. Run the Spark JobServer first, see: [influencer-detector-analytics](https://github.com/dtoledo23/influencer-detector-analytics)

1. Run the Crawler, see: [influencer-detector-crawler](https://github.com/dtoledo23/influencer-detector-crawler)
2. You need a Facebook Page Access Token. Get one from https://developers.facebook.com/docs/pages/access-tokens
3. `cp ./.env.example .env` and fill all the configurations needed
4. `npm install`
5. `npm start`

## How to deploy
1. The app is already dockerized. Make sure you have `git` and `docker` installed on your host server.
2. Create `.env` file with the configuration needed. Take `.env.example` format.
3. Build: `docker build -t influencer-detector-back .`
4. Run: `docker run -d -p 3000:3000 influencer-detector-back`
