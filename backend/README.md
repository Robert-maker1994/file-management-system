## API Endpoints

This is the backend component of a file management system that allows users to create, upload, download, and manage documents and folders. The system is built using Node.js, Express, and Sequelize, with PostgreSQL as the database.

## Technologies Used

This project leverages the following technologies:

*   **Node.js:** 
*   **Express.js:** 
*   **Sequelize:** 
*   **PostgreSQL:**
*   **TypeScript:**
*   **Multer:** 
*   *CORS:** 
*   **Method-Override:** 
*   **Vitest:** 
*   **Biome:** 
*   **Docker:** 
*   **Dotenv:** 
*   **Reflect-metadata:** 

### Folders

- `GET /folders`: Get all folders.
- `POST /folders`: Create a new folder.
- `DELETE /folders/:id`: Delete a folder by ID.

### Documents

- `GET /documents?folderId=:folderId`: Get all documents in a folder.
- `POST /documents/:id/upload`: Upload a new version of a document.
- `GET /documents/:id/download`: Download the latest version of a document.

### File Versions

- `GET /file-versions/document/:documentId`: Get all versions of a document.
- `GET /file-versions/:id`: Get a specific file version by ID.

### Health

- `GET /health`: Check the health status of the backend service.

