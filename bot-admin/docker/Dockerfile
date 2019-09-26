# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:10.16.0 as build-stage
RUN mkdir app
COPY /event-service-application /app/event-service-application
COPY /shared /app/shared
WORKDIR /app/event-service-application

RUN rm package-lock.json
RUN npm install
RUN npm run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15
COPY --from=build-stage /app/event-service-application/build/ /usr/share/nginx/html
# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY --from=build-stage /app/event-service-application/docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8085
