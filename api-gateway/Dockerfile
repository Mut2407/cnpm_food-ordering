# STAGE 1: Build ứng dụng với Maven
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Copy các file cần thiết cho Maven
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Tải dependencies (tận dụng cache)
RUN ./mvnw dependency:go-offline

RUN sed -i 's/\r$//' mvnw

# Copy source code và build
COPY src ./src
RUN ./mvnw clean install -DskipTests

# STAGE 2: Tạo image chạy ứng dụng (nhẹ hơn)
FROM eclipse-temurin:21-jre

WORKDIR /app

# Lấy file .jar từ stage build
ARG JAR_FILE=target/*.jar
COPY --from=build /app/${JAR_FILE} app.jar

# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]