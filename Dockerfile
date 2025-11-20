# --------------------
# Stage 1: Build the Application
# --------------------
FROM maven:3.9.5-amazoncorretto-21 AS build

WORKDIR /app

# Copy everything necessary for the build
COPY pom.xml .
COPY src /app/src

# Build the final executable JAR and skip tests for a faster build
RUN mvn package -DskipTests

# --------------------
# Stage 2: Minimal Runtime Image (Final Image)
# --------------------
# Minimal JRE (Java Runtime Environment) image for a small, secure footprint
FROM amazoncorretto:21-jre-alpine

# Set non-root user for security
RUN addgroup --system javauser && adduser -S -s /bin/false -G javauser javauser
USER javauser
WORKDIR /app

EXPOSE 8080

# Copy only the final, runnable JAR from the 'build' stage
# Ensure the JAR name matches the artifactId-version in your pom.xml
COPY --from=build /app/target/budget-tracker-1.0-SNAPSHOT.jar /app/app.jar

ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=docker"]