FROM node:16.13.1
ADD . .
RUN npm install
RUN npm i -g serve
RUN mv .env .env.production && rm -rf .env
RUN npm run build
EXPOSE 5000

ENTRYPOINT [ "serve", "-s", "build", "-l", "5000"]