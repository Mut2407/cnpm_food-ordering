# Stage 1: Build
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Copy các file cần thiết cho Maven
COPY mvnw pom.xml ./
RUN mkdir -p ./.mvn/wrapper
COPY .mvn/wrapper/maven-wrapper.properties ./.mvn/wrapper/

# Thêm dòng này để cấp quyền thực thi cho file mvnw
RUN chmod +x mvnw

RUN sed -i 's/\r$//' mvnw

# Tải dependencies (tận dụng cache)
RUN ./mvnw dependency:go-offline

# Copy source code và build
COPY src ./src
RUN ./mvnw clean install -DskipTests

# Stage 2: Release
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy file JAR đã build từ stage 1
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]