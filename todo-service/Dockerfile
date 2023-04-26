FROM gradle:jdk17-focal as gradle
COPY --chown=gradle todo-service /home/app
COPY --chown=gradle grpc /home/grpc
WORKDIR /home/app
# https://github.com/google/protobuf-gradle-plugin/issues/265
#RUN apk add gcompat
RUN gradle assemble



FROM openjdk:17-jdk-slim
COPY --from=gradle /home/app/build/libs/*-all.jar app.jar
EXPOSE 8080
CMD java -noverify -jar app.jar