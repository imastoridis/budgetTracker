# Budget Tracker Backend (Spring Boot)

Welcome to my Budget Tracker application! This is a secure, multi-user RESTful API built with Spring Boot, Spring Security, and Spring Data JPA. It uses Angular 21 for the frontend.

**Technology stack**

***Backend***
- Java 21
- Spring Boot
- Maven
- Spring security/JWT
- JPA and Spring Boot Test
- Lombok
- PostgreSQL
- Redis

***FrontEnd***
- Angular 21
- TypeScript
- Tailwind CSS
- Angular Material

- Docker
- Swagger

## Table of Contents

1.  Prerequisites

2.  Project Structure

3.  Setup and Run Locally

4.  Setup and run with Docker

5.  API Endpoints

6.  Documentation

## 1\. Prerequisites

You need the following installed on your machine:

-	**Java Development Kit (JDK) 21 or higher**

-	**Apache Maven** (for building the project) 

-	**Git**

-	**Angular 21**

-	***(Optional)* Docker** (for containerized deployment)

## 2\. Project Structure

The project is structured into three main directories:

.
├── budgetTracker/            # Spring Boot API code (Java/Maven)
│   ├── Dockerfile            # Production multi-stage build (creates final JAR)
│   └── Dockerfile.dev        # Development build (prepares environment for volume mount)
├── budgetTracker_front/      # Angular application code
│   └── DockerFile            # Angular build and Nginx serving
├── docker-compose.yml        # Defines all services and networking
└── README.md                 # This file

Unit, Integration and End-to-end tests are available in budgetTracker/test/java

## 3\. Setup and Run Locally 

This is the easiest way to get the application running, as the default configuration uses an **in-memory H2 database** (`src/main/resources/application.dev.properties`).

### Step 1: Clone the Repository

```
git clone https://github.com/imastoridis/budgetTracker.git
cd budgetTracker
```

### Step 2: Build the Project

Use Maven to compile the code and package it into a runnable JAR file.

```
mvn clean install

```

### Step 3: Run the Application

Execute the packaged JAR file.

```
java -jar target/budget-tracker-1.0-SNAPSHOT.jar
** Note: The JAR name must match your project's artifactId and version from pom.xml**
```

The application will start on `http://localhost:8080`.

**Database Access (H2 Console):** While the application is running, you can view the in-memory database via the H2 Console:

-   **URL:** `http://localhost:8080/h2-console`

-   **JDBC URL:** `jdbc:h2:mem:budgetdb`

-   **User/Password:** `user`/`password`

## 4\. Run with Docker 

To run the entire stack, you only need Docker and Docker Compose installed on your system.

Use this for active coding, rapid restarts, and debugging.

### 1. Development Mode (Recommended for Coding)

This mode is optimized for rapid iteration. The app-dev service mounts your local backend code volume, enabling instant code changes without rebuilding the Docker image.

Command:
```
docker build -f Dockerfile.dev -t budget-tracker-dev .
```

**What this command does:**

Builds all necessary images (app-dev, app-prod, frontend).

Starts the db (PostgreSQL) and redis services.

Starts the app-dev (Backend) service, waiting for the database and Redis to be healthy.

Starts the frontend (Angular) service.

### 2. Production Mode (For Testing the Final Build)

While the full docker compose up -d command starts both the development (app-dev) and production (app-prod) APIs, you can run only the production environment components if needed:

```
docker compose up -d db redis app-prod frontend
```

### Step 2: Run the Development Container

This command maps both the application port (8080) and the default remote debugging port (5005), allowing you to connect your IDE.

```
docker run -p 8080:8080 -p 5005:5005 budget-tracker-dev
```

The application will be accessible at `http://localhost:8080`.

## 5\. API Endpoints

### 1. Services 
Once all services are running, you can access the application components via your local machine's ports:

| Service             | Method | Local Port |  Access URL             | Description                                                   | 
| ------------------- | ------ | ---------------------------------------------------------------------------------------------------- |
| FrontEnd            | HTTP   | 80         | http://localhost/       | The Angular web application.                                  |
| Dev API (Backend)   | HTTP   | 8080       | http://localhost:8080/  | Spring Boot API with volume mounting (use for development)    |
| Prod API (Backend)  | HTTP   | 8081       | http://localhost:8081/  | Spring Boot API running the built JAR (use for final testing) |
| PostgreSQL          | TCP    | 5432       | localhost:5432          | Accessible for external DB tools.                             |


### 2. Endpoints 

The API requires a registered user to access most resources. Registration/Authentication endpoints should be accessible first.

| Endpoint            | Method | Description                                           | Authentication |
| ------------------- | ------ | ----------------------------------------------------- | -------------- |
| `/api/register`     | `POST` | Registers a new user.                                 | None           |
| `/login`            | `POST` | Authenticates a user and issues a session cookie.     | None           |
| `/api/categories`   | `GET`  | Retrieve all categories for the authenticated user.   | Required       |
| `/api/categories`   | `POST` | Create a new category.                                | Required       |
| `/api/transactions` | `GET`  | Retrieve all transactions for the authenticated user. | Required       |
| `/api/transactions` | `POST` | Create a new transaction.                             | Required       |
| `/api/transactions` | `PUT`  | Update an existing transaction.                       | Required       |
| `/api/transactions` | `DELETE` | Delete a transaction.                               | Required       |


### 3. Cleanup

To stop all running containers, remove them, and delete the associated volumes (which contain your database and Redis data):

# Stops and removes all containers, networks, and images
```
docker compose down
```

# Stops, removes containers, networks, images, AND deletes database/redis data volumes
```
docker compose down --volumes
```

## 5\. API Endpoints

Documentation is accessible here:
```
http://localhost:8080/swagger-ui.html
```