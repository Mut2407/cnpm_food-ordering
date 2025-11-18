# Stage 1: Build
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Copy các file cần thiết cho Maven
COPY mvnw pom.xml ./
COPY .mvn ./.mvn

# Cấp quyền thực thi và sửa lỗi line ending
RUN chmod +x mvnw
RUN sed -i 's/\r$//' mvnw 

# ---- THÊM BƯỚC NÀY ----
# Tải dependencies (tận dụng cache và gỡ lỗi)
RUN ./mvnw dependency:go-offline

# Copy mã nguồn
COPY src ./src

# Build ứng dụng
RUN ./mvnw clean install -DskipTests

# Stage 2: Release
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy file JAR đã build từ stage 1
COPY --from=build /app/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]