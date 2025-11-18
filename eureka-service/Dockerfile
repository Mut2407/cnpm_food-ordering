# e.g. copy this into eureka-service/Dockerfile (and same for other services)
# Stage 1: build
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Copy only wrapper + pom + mvnw first (better cache)
COPY mvnw .
COPY pom.xml .
COPY .mvn/wrapper .mvn/wrapper

# Fix permissions, CRLF and BOM in wrapper files (safe)
RUN chmod +x mvnw \
    && sed -i 's/\r$//' mvnw \
    && sed -i '1s/^\xef\xbb\xbf//' .mvn/wrapper/maven-wrapper.properties || true

# Download dependencies
RUN ./mvnw -B dependency:go-offline

# Copy source and build
COPY src ./src
RUN ./mvnw -B -DskipTests clean package

# Stage 2: runtime
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy jar from build stage
# If your service produces a single jar in target, this will work
COPY --from=build /app/target/*.jar app.jar

ENTRYPOINT ["java","-jar","/app/app.jar"]
