# Stage 1: Build
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Copy các file cần thiết cho Maven
COPY mvnw pom.xml ./
RUN mkdir -p ./.mvn/wrapper
COPY .mvn/wrapper/maven-wrapper.properties ./.mvn/wrapper/

# Copy mã nguồn
COPY src ./src

# Cấp quyền thực thi và sửa lỗi line ending
RUN chmod +x mvnw
RUN sed -i 's/\r$//' mvnw 

# === SỬA LỖI SHA-256 ===
# Bỏ qua 'dependency:go-offline' và build trực tiếp
RUN ./mvnw clean install -DskipTests

# Stage 2: Release
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy file JAR đã build từ stage 1
COPY --from=build /app/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]