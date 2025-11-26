# --------------------
# Stage 1: Build the Application
# --------------------
# Standardizing on Eclipse Temurin for consistency with the development build
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

WORKDIR /app

# Copy everything necessary for the build
COPY pom.xml .
COPY src /app/src

# Build the final executable JAR
RUN mvn package -DskipTests

# --------------------
# Stage 2: Minimal Runtime Image (Final Image)
# --------------------
# Minimal JRE 21 image for a small, secure footprint
FROM eclipse-temurin:21-jre-alpine

# Set non-root user for security
RUN addgroup --system javauser && adduser -S -s /bin/false -G javauser javauser
USER javauser
WORKDIR /app

EXPOSE 8080

# Copy only the final, runnable JAR from the 'build' stage
COPY --from=build /app/target/budget-tracker-1.0-SNAPSHOT.jar /app/app.jar

# Activates the 'docker' profile for PostgreSQL/Redis configuration
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=docker"]