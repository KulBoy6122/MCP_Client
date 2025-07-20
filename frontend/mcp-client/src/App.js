// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);

  const handleFolderUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles(uploadedFiles);

    uploadedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target.result;
        await axios.post('http://localhost:5000/create-file', {
          filename: file.webkitRelativePath,
          content,
        });
      };
      reader.readAsText(file);
    });

    alert('Folder uploaded and files sent to server');
  };

  const handleEdit = async (filename) => {
    const newContent = prompt(`Enter new content for file: ${filename}`);
    if (newContent !== null) {
      await axios.post('http://localhost:5000/edit-file', {
        filename,
        newContent,
      });
      alert('File content updated');
    }
  };

  const handleDelete = async (filename) => {
    await axios.delete('http://localhost:5000/delete-file', {
      data: { filename },
    });
    alert('File deleted');
    setFiles(prev => prev.filter(file => file.webkitRelativePath !== filename));
  };
  const handleView = async (filename) => {
  const res = await axios.post('http://localhost:5000/read-file', { filename });
  alert(`📄 Content of ${filename}:\n\n` + res.data.content);
};


  return (
    <div className="container">
      <h2>📁 MCP File Manager</h2>
      <input
        type="file"
        webkitdirectory="true"
        directory=""
        multiple
        onChange={handleFolderUpload}
      />

      <ul className="file-list">
        {files.map(file => (
          <li key={file.webkitRelativePath} className="file-item">
            <span>{file.webkitRelativePath}</span>
            <button onClick={() => handleView(file.webkitRelativePath)} className="view-btn">View</button>
            <button onClick={() => handleEdit(file.webkitRelativePath)} className="edit-btn">Edit</button>
            <button onClick={() => handleDelete(file.webkitRelativePath)} className="delete-btn">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;



