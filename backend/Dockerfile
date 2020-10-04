FROM openjdk:11 AS builder

COPY . /home/backend

WORKDIR /home/backend

RUN ./gradlew clean build

FROM openjdk:11

COPY --from=builder /home/backend/build/libs/mmflow-0.0.1-SNAPSHOT-all.jar .

EXPOSE 8090

ENTRYPOINT java -server -jar mmflow-0.0.1-SNAPSHOT-all.jar