# Requirements Document

## Introduction

This document outlines the requirements for fixing critical bugs and improving functionality in the Tracker Hub application. The application is a productivity dashboard that manages tasks, habits, finances, and vision boards using Supabase as the backend.

## Glossary

- **System**: The Tracker Hub web application
- **User**: An authenticated person using the application
- **Supabase**: The backend database and authentication service
- **Vision Board**: A visual goal-setting feature where users create boards with items
- **Habit**: A trackable recurring activity
- **Task**: A to-do item with due date, priority, and status
- **Finance Module**: The income/expense tracking feature with monthly budgets
- **Total Balance**: The user's starting balance for a given month stored in monthly_budgets table
- **Export Function**: Feature to download finance data as a file

## Requirements

### Requirement 1

**User Story:** As a user, I want to create vision boards without errors, so that I can track my goals visually.

#### Acceptance Criteria

1. WHEN a user creates a new vision board THEN the System SHALL generate a valid UUID for the id field
2. WHEN the vision board is saved to Supabase THEN the System SHALL include all required fields including user_id
3. IF the vision board creation fails THEN the System SHALL display a meaningful error message to the user
4. WHEN a vision board is successfully created THEN the System SHALL add it to the user's board list immediately

### Requirement 2

**User Story:** As a user, I want to create habits without database errors, so that I can track my daily activities.

#### Acceptance Criteria

1. WHEN a user creates a new habit THEN the System SHALL generate a valid UUID for the id field
2. WHEN the habit is saved to Supabase THEN the System SHALL include the user_id field
3. IF the habit creation fails due to null id THEN the System SHALL retry with a properly generated UUID
4. WHEN a habit is successfully created THEN the System SHALL refresh the habits list

### Requirement 3

**User Story:** As a user, I want to edit tasks inline, so that I can quickly update task details without opening dialogs.

#### Acceptance Criteria

1. WHEN a user types in a task title field THEN the System SHALL update the task in real-time
2. WHEN a user changes task priority THEN the System SHALL persist the change to Supabase immediately
3. WHEN a user changes task status THEN the System SHALL update the database and refresh the UI
4. WHEN a user changes task due date THEN the System SHALL save the new date to the database
5. WHEN a user changes task category THEN the System SHALL update the task record in Supabase

### Requirement 4

**User Story:** As a user, I want my total balance to persist across sessions, so that I don't lose my financial starting point.

#### Acceptance Criteria

1. WHEN a user sets a total balance for a month THEN the System SHALL save it to the monthly_budgets table with budget_limit field
2. WHEN a user navigates to a different month THEN the System SHALL load the total balance from the database
3. WHEN a user returns to the finance page THEN the System SHALL display the previously saved total balance
4. WHEN no total balance exists for a month THEN the System SHALL default to zero and allow the user to set it

### Requirement 5

**User Story:** As a user, I want to export finance data as an Excel file only, so that I can analyze it in spreadsheet software.

#### Acceptance Criteria

1. WHEN a user clicks the Export Data button THEN the System SHALL generate only an Excel-compatible CSV file
2. WHEN the export completes THEN the System SHALL NOT generate a JSON file
3. WHEN the file is downloaded THEN the System SHALL name it with the format finance_export_YYYY-MM.csv
4. WHEN the CSV is opened THEN the System SHALL include all metrics, income data, expense data, and debt data

### Requirement 6

**User Story:** As a user, I want finance charts to be consistently sized, so that the dashboard looks professional and balanced.

#### Acceptance Criteria

1. WHEN finance charts are displayed THEN the System SHALL render them with the same height as task tab charts
2. WHEN the viewport is resized THEN the System SHALL maintain consistent chart proportions
3. WHEN multiple charts are in a row THEN the System SHALL ensure equal heights across all chart containers

### Requirement 7

**User Story:** As a user, I want the dashboard to show accurate real-time data, so that I can trust the information displayed.

#### Acceptance Criteria

1. WHEN the dashboard loads THEN the System SHALL fetch current data from Supabase for all modules
2. WHEN a user completes a task THEN the System SHALL update the dashboard task count immediately
3. WHEN a user adds a transaction THEN the System SHALL reflect the change in the dashboard finance summary
4. WHEN data fails to load THEN the System SHALL display an error state with retry option

### Requirement 8

**User Story:** As a developer, I want all Supabase operations to handle errors gracefully, so that users receive helpful feedback.

#### Acceptance Criteria

1. WHEN a Supabase operation fails THEN the System SHALL log the error details to the console
2. WHEN a database constraint is violated THEN the System SHALL display a user-friendly error message
3. WHEN authentication fails THEN the System SHALL redirect the user to the login page
4. WHEN a network error occurs THEN the System SHALL show a retry button to the user
