# Budget Tracker Backend (Spring Boot)

Welcome to my Budget Tracker application! This is a secure, multi-user RESTful API built with Spring Boot, Spring Security, and Spring Data JPA.

## Table of Contents

1.  Prerequisites

2.  Setup and Run Locally (Recommended)

3.  Run with Docker

4.  API Endpoints

## 1\. Prerequisites

You need the following installed on your machine:

-	**Java Development Kit (JDK) 21 or higher**

-	**Apache Maven** (for building the project) 

-	**Git**

-	***(Optional)* Docker** (for containerized deployment)

## 2\. Setup and Run Locally (Recommended)

This is the easiest way to get the application running, as the default configuration uses an **in-memory H2 database** (`src/main/resources/application.dev.properties`).

### Step 1: Clone the Repository

```
git clone <your_github_repo_url>
cd budget-tracker-backend
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

## 3\. Run with Docker (Development Setup `Dockerfile.dev`)

This project provides specialized Dockerfiles for different use cases. You must use the `-f` flag to specify which one to use.

Use this for active coding, rapid restarts, and debugging.

### Step 1: Build the Development Docker Image

```
docker build -f Dockerfile.dev -t budget-tracker-dev .
```

### Step 2: Run the Development Container

This command maps both the application port (8080) and the default remote debugging port (5005), allowing you to connect your IDE.

```
docker run -p 8080:8080 -p 5005:5005 budget-tracker-dev
```

The application will be accessible at `http://localhost:8080`.

## 4\. API Endpoints

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
