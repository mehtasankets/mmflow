FROM eclipse-temurin:11-jdk AS builder

COPY . /home/backend

WORKDIR /home/backend

RUN ./gradlew clean build

FROM eclipse-temurin:11-jdk

COPY --from=builder /home/backend/build/libs/mmflow-0.0.1-SNAPSHOT-all.jar .

EXPOSE 8090

ENTRYPOINT java -server -jar mmflow-0.0.1-SNAPSHOT-all.jar
