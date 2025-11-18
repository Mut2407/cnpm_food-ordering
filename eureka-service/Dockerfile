# Stage 1: Build
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Copy Maven wrapper and config
COPY mvnw pom.xml ./
COPY .mvn ./.mvn

# Fix permissions + CRLF issues
RUN chmod +x mvnw \
    && sed -i 's/\r$//' mvnw \
    && sed -i 's/\r$//' .mvn/wrapper/maven-wrapper.properties

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src ./src

# Build application
RUN ./mvnw clean install -DskipTests -B

# Stage 2: Release
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
