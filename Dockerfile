FROM adoptopenjdk/openjdk16:ubi
COPY build/libs/smeta-0.0.1-SNAPSHOT.jar /app.jar

ENTRYPOINT ["java", "-jar", "/app.jar"]