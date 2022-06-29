FROM node:12.19.0 AS builder

COPY . /home/frontend

WORKDIR /home/frontend

RUN npm install

RUN npm build

FROM node:12.19.0

COPY --from=builder /home/frontend .

EXPOSE 8080

ENTRYPOINT npm start
