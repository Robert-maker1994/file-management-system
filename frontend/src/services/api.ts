import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:5001",
});


export interface Folder {
  id: number;
  name: string;
  path: string;
  createdAt: string;
  updatedAt: string;
}

export const getFolders = async () => {
  const response = await api.get<Folder[]>('/folders');
  return response.data;
};

export const createFolder = async (name: string) => {
  const response = await api.post('/folders', { name });
  return response.data;
};
export const deleteFolder = async (id: string) => {
  const response = await api.delete(`/folders/${id}`);
  return response.data
}


export const getDocuments = async (folderId?: string) => {
  const url = folderId ? `/documents?folderId=${folderId}` : '/documents';
  const response = await api.get(url);
  return response.data;
};

export const createDocument = async (title: string, description: string, folderId: string, file: File) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('folderId', folderId);

  formData.append('file', file);
  const response = await api.post('/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  return response.data;
};

export const deleteDocument = async (id: string) => {
  const response = await api.delete(`/documents/${id}`);
  return response.data;
}

export const uploadFile = async (documentId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(`/documents/${documentId}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const downloadFile = async (documentId: string) => {
  const url =`/documents/${documentId}/download`;

  const response = await api.get(url, { responseType: 'blob'});
  
  const blob = new Blob([response.data]);
  const blobURL = window.URL.createObjectURL(blob);
  
  
  const link = document.createElement('a');
  link.href = blobURL;

  const contentDisposition = response.headers['content-disposition'];   console.log(contentDisposition, response.headers)
  let fileName = `document_${documentId}`;

  if (contentDisposition) {
    const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
    if (fileNameMatch && fileNameMatch[1]) {
      fileName = fileNameMatch[1];
    }
  }

  link.setAttribute('download', fileName);

  document.body.appendChild(link);

  link.click();

  window.URL.revokeObjectURL(blobURL);
  link.remove();
};

export const getAllVersion = async (documentId: string) => {
  const response = await api.get(`/file-versions/document/${documentId}`);
  return response.data;
} 



export default api;