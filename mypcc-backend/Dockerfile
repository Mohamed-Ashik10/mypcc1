# Stage 1: Build the application
FROM gradle:8.5-jdk17 AS build
WORKDIR /app

# Copy the build configuration and source code
COPY build.gradle settings.gradle /app/
COPY src /app/src

# Build the application, skipping tests for speed (can be re-enabled)
RUN gradle build -x test --no-daemon

# Stage 2: Run the application
FROM openjdk:17-slim
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose the server port
EXPOSE 8080

# Environment variables (overridable at runtime)
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
