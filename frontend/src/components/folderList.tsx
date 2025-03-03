import React, { useState, useEffect } from 'react';
import { getFolders, deleteFolder, Folder, createFolder } from '../services/api';
import { Link } from "react-router"
import "./document.css"
const FolderList = () => {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!folders.length) {
            getFolders().then((data) => {
                setFolders([...data, ...folders])
                setLoading(false);
            }).catch((err) => {
                console.log(err)
                setError(err.message || 'Failed to fetch folders');
            });
        }
    });
    console.log(folders)

    const handleFolderCreated = (newFolder: Folder) => {
        setFolders([...folders, newFolder]);
    };
    const handleDeleteFolder = async (folderId: string) => {
        try {
            await deleteFolder(folderId);
            setFolders(folders.filter((folder) => folder.id.toString() !== folderId)); //update list

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to fetch folders');
            }
        }
    }

    if (loading) {
        return <div>Loading folders...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div >
            <h2 className='document-title'>Folders</h2>
            <ul className='document-list'>
                {folders?.map((folder) => (
                    <li className='document-item' key={folder.id}>
                        <Link className='document-title' to={`/folders/${folder.id}`}>{folder.name}</Link>
                        <button className='delete-button' color="primary" onClick={() => handleDeleteFolder(folder.id.toString())}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            <NewFolderForm onFolderCreated={handleFolderCreated} />
        </div>
    );
};


interface NewFolderFormProps {
    onFolderCreated: (newFolder: Folder) => void;
}

const NewFolderForm: React.FC<NewFolderFormProps> = ({ onFolderCreated }) => {
    const [folderName, setFolderName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await createFolder(folderName);

            if (!response) {
                throw new Error('Failed to create folder');
            }

            onFolderCreated(response);
            setFolderName('');

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to create folder');
            }
        }
    };

    return (
        <div className='create-document-form'>
            <h3>Create New Folder</h3>
            <form className='form' onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    placeholder="Folder Name"
                    required
                />
                <button type="submit">Create Folder</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};


export default FolderList;