# STAGE 1: Build ứng dụng Angular
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm ci

# Copy toàn bộ source code của frontend
COPY . .

# Build ứng dụng cho production
# Dựa trên angular.json, output path là "dist/frontend/browser"
RUN npm run build -- --configuration production

# STAGE 2: Serve ứng dụng bằng Nginx
FROM nginx:alpine

# Copy kết quả build từ stage 1 vào thư mục phục vụ web của Nginx
# (Angular 17 builder lưu kết quả trong thư mục con 'browser')
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copy file cấu hình Nginx (quan trọng để Angular routing hoạt động)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80