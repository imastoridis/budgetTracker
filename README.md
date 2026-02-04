# Budget Tracker Application (Spring Boot)

Welcome to my Budget Tracker application! This is a secure, multi-user RESTful API built with Spring Boot, Spring Security, and Spring Data JPA.

It uses Angular 21 for the frontend.

The application is live at https://imastoridis.com/budgetTracker

The documentation is available at https://imastoridis.com/budgetTracker/documentation/index.html

## Testing the application

You can test the application with these credentials

- Username: test_user
- Password: 1234Test!

## Technology stack

- Docker
- Swagger
- Prometheus / Grafana
- Ansible / Ansible Vault

**_Backend_**

- Java 21
- Spring Boot
- Maven
- Spring security/JWT
- JPA and Spring Boot Test
- Lombok
- PostgreSQL
- Redis

**_FrontEnd_**

- Angular 21
- TypeScript
- TailwindCSS
- Angular Material
- Vitest

## Table of Contents

1.  Prerequisites
2.  Project Structure
3.  Setup and run with Docker
4.  API Endpoints
5.  Documentation

## 1\. Prerequisites

You need the following installed on your machine:

- **Docker**

## 2\. Project Structure

The project is structured into two main directories:

```
├── budgetTracker/            # Spring Boot API code (Java/Maven)
│   ├── Dockerfile            # Production multi-stage build (creates final JAR)
│   └── Dockerfile.dev        # Development build (prepares environment for volume mount)
├── budgetTracker_front/      # Angular application code
│   └── DockerFile            # Angular build and Nginx serving
├── docker-compose.yml        # Defines all services and networking
└── README.md                 # This file
└── .env.example              # The .env file

```

Unit, Integration and End-to-end tests are available in `budgetTracker/test/java`

## 3\. Setup and Run with Docker

To run the entire stack, you only need Docker and Docker Compose installed on your system.

Use this for active coding, rapid restarts, and debugging.

#### 3.1. Clone the Repository

```bash
git clone https://github.com/imastoridis/budgetTracker.git
cd budgetTracker
```

#### 3.2. Configure Environment Variables

This project uses environment variables to keep sensitive data (like database passwords) secure. You must create your own .env file before starting the application.

    - Locate the .env.example file in the root directory.
    - Rename it to .env:
    - Add a password to the DB_PASSWORD environment variable (e.g. password123).

#### 3.3 Run with Docker

This mode is optimized for rapid iteration. The app-dev service mounts your local backend code volume, enabling instant code changes without rebuilding the Docker image.

Command:

```bash
docker compose up --build -d app-dev frontend-dev
```

**What this command does:**

- Builds all necessary images (app-dev, frontend-dev).
- Starts the db (PostgreSQL) and redis services.
- Starts the app-dev (Backend) service, waiting for the database and Redis to be healthy.
- Starts the frontend (Angular) service with live reloading.

The application will be accessible at `http://localhost:4200`.

## 4\. API Endpoints

### 4.1. Services

Once all services are running, you can access the application components via your local machine's ports:

```
| Service             | Method | Local Port |  Access URL             | Description                                                   |
| ------------------- | ------ | ---------------------------------------------------------------------------------------------------- |
| FrontEnd            | HTTP   | 4200       | http://localhost:4200/  | The Angular web application.                                  |
| Dev API (Backend)   | HTTP   | 8080       | http://localhost:8080/  | Spring Boot API with volume mounting (use for development)    |
| Prod API (Backend)  | HTTP   | 8081       | http://localhost:8081/  | Spring Boot API running the built JAR (use for final testing) |
| PostgreSQL          | TCP    | 5432       | localhost:5432          | Accessible for external DB tools.                             |
```

### 4.2. BackEnd Endpoints

The API requires a registered user to access most resources. Registration/Authentication endpoints should be accessible first.

| Endpoint             | Method   | Description                                           | Authentication |
| -------------------- | -------- | ----------------------------------------------------- | -------------- |
| `/api/auth/register` | `POST`   | Registers a new user.                                 | None           |
| `/api/auth/login`    | `POST`   | Authenticates a user and issues a session cookie.     | None           |
| `/api/categories`    | `GET`    | Retrieve all categories for the authenticated user.   | Required       |
| `/api/categories`    | `POST`   | Create a new category.                                | Required       |
| `/api/transactions`  | `GET`    | Retrieve all transactions for the authenticated user. | Required       |
| `/api/transactions`  | `POST`   | Create a new transaction.                             | Required       |
| `/api/transactions`  | `PUT`    | Update an existing transaction.                       | Required       |
| `/api/transactions`  | `DELETE` | Delete a transaction.                                 | Required       |

### 4.3. Cleanup

To stop all running containers, remove them, and delete the associated volumes (which contain your database and Redis data):

#### Stops and removes all containers, networks, and images

```bash
docker compose down
```

#### Stops, removes containers, networks, images, AND deletes database/redis data volumes

```bash
docker compose down --volumes
```

## 5\. Documentation

Documentation is accessible here:

```bash
https://imastoridis/budgetTracker/documentation/swagger-ui/index.html
```
