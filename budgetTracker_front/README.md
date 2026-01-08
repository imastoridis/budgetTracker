# BudgetTrackerFront

Welcome to my Budget Tracker application! It's a simple budget tracker, where you can create categories, add,delete and update income or expense transactions and visualize your balance and spending through charts and tables.

The app is a modern Angular application utilizing Signals for reactive state management and RxJS for event-driven asynchronous operations. The application is designed as a single-page dashboard that avoids full-page reloads by synchronizing data through centralized state services.

The backend was created using Java.

The application is live at https://imastoridis/budgetTracker

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.0.

## Table of Contents

1.  Prerequisites
2.  Functionallities
3.  Setup and run
4.  Running unit tests
5.  Core Components
6.  State management
7.  Data flow exemple

### 1. Prerequisites

Angular 21

### 2. Functionallities

- Create categories
- Create income/expense transactions
- Update income
- Delete
- Visualize the transactions through charts and tables for each month
- Visualize the balance

### 3. Setup and run

#### Step 1: Clone the Repository

```bash
git clone https://github.com/imastoridis/budgetTracker.git
cd budgetTracker
```

#### Step 2: npm install

```bash
npm install
```

#### Step 3: Run the development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### 4. Running unit tests

To execute unit tests with the [Vitest] test runner, use the following command:

```bash
ng test
```

### 5.Core components

#### Dashboard Component (app-dashboard)

The orchestrator component. It manages the global date signal and triggers data fetching through various services.

#### DashboardSidebar Component (app-dashboard-sidebar)

Manages the sidebar of the app, displays monthly totals, charts as well as the buttons for adding a transaction and creating a new category.

#### DashboardSummary Component (app-dashboard-summary)

Manages the main part of the app, displays the categories as well as the tables for the transactions

### 6. State management

The project utilizes a Services-as-State pattern. Instead of complex stores, specialized services hold signal arrays that updates the signals throughout the application.

| Service Name             | Responsibility                                                          |
| ------------------------ | ----------------------------------------------------------------------- |
| CategoriesStateService   | Manages the list of categories and their monthly totals                 |
| TransactionsStateService | Manages separate signals for Income and Expense transactions.           |
| DashboardEventsService   | Provides an RxJS stream for cross-component events like date selection. |

### 7. Data flow exemple

1. The user selects a new month in the app-datepicker-sidebar.
2. DashboardEventsService emits the new date via changedDate$.
3. DashboardComponent receives the date and sets its local date signal.
4. Five concurrent API calls are triggered: getCategoriesWithTotal, getAllTransactionsIncome, getAllTransactionsExpense, and the two monthly totals.
5. As services receive data, they update their respective Signals.
6. The PieChartDisplay and DashboardSummary automatically re-render due to their dependency on those Signals.
