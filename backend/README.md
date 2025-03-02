## API Endpoints

### Folders

- `GET /folders`: Get all folders.
- `POST /folders`: Create a new folder.
- `DELETE /folders/:id`: Delete a folder by ID.

### Documents

- `GET /documents?folderId=:folderId`: Get all documents in a folder.
- `POST /documents`: Create a new document.
- `DELETE /documents/:id`: Delete a document by ID.
- `POST /documents/:id/upload`: Upload a new version of a document.
- `GET /documents/:id/download`: Download the latest version of a document.

### File Versions

- `GET /file-versions/document/:documentId`: Get all versions of a document.
- `GET /file-versions/:id`: Get a specific file version by ID.

### Health

- `GET /health`: Check the health status of the backend service.

