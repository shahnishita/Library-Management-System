# Library Management System - Backend

Welcome to the backend of the Library Management System. This project is designed to manage the operations of a library, providing an intuitive interface for users to interact with the system.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Introduction
This is the backend part of a Library Management System built with Django. The backend handles the business logic, data storage, and API endpoints for the application.

## Features
- User authentication and authorization
- Book management (CRUD operations)
- Borrow request management
- Track popular books
- Email and notification system

## Installation
To get started with the frontend, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PRASSamin/Library-Management-System.git
   cd library-management-system/WEB_Server
   ```

2. **Setup Virtual Environment:**
   ```bash
    python3 -m venv .venv
    source .venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up the database:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Create a superuser:**
   ```bash
   python manage.py createsuperuser
   ```
4. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

## Usage
Once the development server is running, you can access the admin panel at http://127.0.0.1:8000/admin and the API at http://127.0.0.1:8000/api.

## Environment Variables

Create a .env file in the root of the backend folder and configure the following environment variables:

- TOKEN_GENERATOR_CODE = YOUR_TOKEN_GENERATOR_CODE
- JWT_ENCRYPTION_KEY = YOUR_JWT_ENCRYPTION_KEY
- EMAIL_HOST_USERNAME = YOUR_SMTP_USERNAME
- EMAIL_HOST_PASSWORD = YOUR_SMTP_PASSWORD

## Technologies Used
- Python
- Django
- Django Rest Framework
- Celery
- Redis
- Postgres

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure that your code follows the project's coding standards and includes appropriate tests.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.