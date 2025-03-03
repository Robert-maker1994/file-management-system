import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getDocuments, createDocument, downloadFile, deleteDocument, uploadFile, getAllVersion } from '../services/api';
import './document.css';

interface Document {
    id: number;
    title: string;
    description: string;
    folderId: number;
    createdAt: string;
    updatedAt: string;
}
interface FileVersion {
    id: number;
    filePath: string;
    version: number;
    documentId: number;
    uploadDate: string;
    createdAt: string;
    updatedAt: string;
}

const DocumentList: React.FC = () => {
    const { folderId } = useParams<{ folderId: string }>(); 
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [fileVersions, setFileVersions] = useState<FileVersion[]>([]);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                if (folderId) {
                    const data = await getDocuments(folderId);
                    setDocuments(data);
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message || 'Failed to fetch documents');
                } else {
                    setError('An unknown error occurred while fetching documents');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [folderId]);

    useEffect(() => { 
        const fetchFileVersions = async () => {
            try {
                if (documents.length > 0) { //ensure documents exist
                    const versions = await Promise.all( //fetch all versions
                        documents.map((doc) => getAllVersion(doc.id.toString()))
                    );
                    const flattenedVersions = versions.flat();
                    setFileVersions(flattenedVersions)
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message || 'Failed to fetch documents');
                } else {
                    setError('An unknown error occurred while fetching documents');
                }
            }
        }

        fetchFileVersions();
    }, [documents]);

    const handleDocumentCreated = (newDocument: Document) => {
        setDocuments([...documents, newDocument]);
    };

    const handleFileUploaded = async () => { //refresh to see new versions
        const versions = await Promise.all( //fetch all versions
            documents.map((doc) => getAllVersion(doc.id.toString()))
        );
        const flattenedVersions = versions.flat();
        setFileVersions(flattenedVersions)
        console.log('File uploaded successfully');
    }
    const handleDownload = async (documentId: string) => {
        try {
            await downloadFile(documentId)
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to download file');
            } else {
                setError('An unknown error occurred while fetching documents');
            }
        }
    }
    const handleDeleteDocument = async (documentId: string) => {
        try {
            await deleteDocument(documentId);
            setDocuments(documents.filter((doc) => doc.id.toString() !== documentId))
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to delete document');
            } else {
                setError('An unknown error occurred while fetching documents');
            }
        }
    }


    if (loading) {
        return <div>Loading documents...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    return (
        <div>
            <h2 className='document-title'>Documents</h2>
            <Link to="/" className="back-to-folders">
                Back to Folders
            </Link>
            {folderId ? (
                <>
                    <ul className="document-list">
                        {documents.map((document) => (
                            <li key={document.id} className="document-item">
                                <div className="document-info">
                                    <p className="document-title">Title: {document.title}</p>
                                    <p className="document-description">Description: {document.description}</p>
                                </div>
                                <div className="document-actions">
                                    <FileUpload
                                        documentId={document.id.toString()}
                                        onFileUploaded={handleFileUploaded}
                                    />
                                    <div className="button-container">
                                        <button
                                            onClick={() => handleDownload(document.id.toString())}
                                            className="download-button"
                                        >
                                            Download Latest
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDocument(document.id.toString())}
                                            className="delete-button"
                                        >
                                            Delete Document
                                        </button>
                                    </div>
                                </div>
                                <ul className="file-versions">
                                    {fileVersions
                                        .filter((version) => version.documentId === document.id)
                                        .map((version) => (
                                            <li
                                                key={version.id}
                                                className="file-version-item"
                                            >
                                                <span className="version-label">
                                                    Version {version.version}
                                                </span>
                                                <span className="upload-date">
                                                    Uploaded on:{' '}
                                                    {new Date(
                                                        version.uploadDate
                                                    ).toLocaleDateString()}
                                                </span>
                                            </li>
                                        ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                    <CreateDocumentForm
                        folderId={folderId}
                        onDocumentCreated={handleDocumentCreated}
                    />
                </>
            ) : (
                <p>Select a folder to view documents.</p>
            )}
        </div>
    );
};


interface Props {
    folderId: string;
    onDocumentCreated: (document: Document) => void;
}


const CreateDocumentForm: React.FC<Props> = ({ folderId, onDocumentCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (file) {
            const newDocument = await createDocument(title, description, folderId, file);
            onDocumentCreated(newDocument);
            setTitle('');
            setDescription('');
            setFile(null)
        }
    };

    return (
        <div className="document-list">
            <h3>Create New Document</h3>
            <form className="document-list" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Document Title"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Document Description"
                    />
                </div>
                <input type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files.length > 0) {
                        setFile(e.target.files[0]);
                    }
                }} id='fileInput' />
                <button type="submit">Create</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

interface FileUploadProps {
    documentId: string;
    onFileUploaded: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ documentId, onFileUploaded }) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!file) {
            setError('Please select a file');
            return;
        }

        try {
            await uploadFile(documentId, file);
            onFileUploaded();
            setFile(null)
            const fileInput = document.getElementById('fileInput') as HTMLInputElement;
            if (fileInput) {
                fileInput.value = '';
            }

        } catch (err: unknown) {
            if(err instanceof Error) {
                setError(err.message || 'File upload failed');
            }

        }
    };

    return (
        <div className="file-upload">
            <h4>Upload File</h4>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} id='fileInput' />
                <button type="submit" className="upload-button" disabled={!file}>Upload</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};


export default DocumentList;
