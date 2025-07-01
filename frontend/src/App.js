import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function App() {
    const [pdfFile, setPdfFile] = useState(null);
    const [markdown, setMarkdown] = useState('');
    const [pdfUrl, setPdfUrl] = useState('');
    const [numPages, setNumPages] = useState(null);

    const onFileChange = (event) => {
        setPdfFile(event.target.files[0]);
    };

    const onUpload = async () => {
        if (!pdfFile) {
            return;
        }

        const formData = new FormData();
        formData.append('pdf', pdfFile);

        try {
            const response = await axios.post('http://localhost:3001/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMarkdown(response.data.markdown);
            setPdfUrl(`http://localhost:3001${response.data.pdfUrl}`);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const downloadMarkdown = () => {
        const element = document.createElement('a');
        const file = new Blob([markdown], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'converted.md';
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="App">
            <h1>PDF to Markdown Converter</h1>
            <input type="file" onChange={onFileChange} />
            <button onClick={onUpload}>Convert</button>

            <div style={{ display: 'flex', marginTop: '20px' }}>
                <div style={{ width: '50%', borderRight: '1px solid #ccc', padding: '10px' }}>
                    <h2>PDF Preview</h2>
                    {pdfUrl && (
                        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
                            {Array.from(new Array(numPages), (el, index) => (
                                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                            ))}
                        </Document>
                    )}
                </div>
                <div style={{ width: '50%', padding: '10px' }}>
                    <h2>Markdown Preview</h2>
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                    {markdown && <button onClick={downloadMarkdown}>Download Markdown</button>}
                </div>
            </div>
        </div>
    );
}

export default App;