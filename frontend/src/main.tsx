import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";

import App from './App.tsx'
import DocumentList from './components/documentList.tsx';

createRoot(document.getElementById('root')!).render(
  <>
    <h3>File Management system</h3>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/folders/:folderId" element={<DocumentList />} />
        <Route path="/documents/:documentId" element={<DocumentList />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  </>
);
