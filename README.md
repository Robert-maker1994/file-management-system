# File Management System

This project is a file management system that allows users to create, upload, download, and manage documents and folders. The system is built with a backend using Node.js, Express, and Sequelize, and a frontend using React and TypeScript.

## Features

- **Folder Management**: Create, view, and delete folders.
- **Document Management**: Create, view, upload, download, and delete documents within folders.
- **File Versioning**: Maintain multiple versions of documents.
- **Health Check**: Endpoint to check the health status of the backend service.

## Technologies Used

### Backend

- Node.js
- Express
- Sequelize (PostgreSQL)
- TypeScript

### Frontend

- React
- TypeScript
- Axios

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/yourusername/file-management-system.git
    cd file-management-system
    ```

2. Start the services using Docker Compose:

    ```sh
    docker-compose up --build
    ```

3. Access the frontend application at `http://localhost:8080`.

