import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Uploader from './App.jsx';

// Ensure the main App component is wrapped in the root renderer
// and rendered into the root element.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Uploader />
    </div>
  </React.StrictMode>
);

// We still need the original Uploader component content, which was assumed 
// to be in 'src/App.jsx.jsx' but we will rename the component to Uploader.
// Since we deleted the original file, I will reconstruct the main logic 
// in a single file environment structure. 
// NOTE: I am renaming the main component to 'UploaderComponent' internally 
// to ensure the final exported name is 'Uploader' for the above render call.

const UploaderComponent = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [blobUrl, setBlobUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // The upload function now uses the simple relative path '/api/upload'
  // which is handled correctly by Vercel's internal routing.
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setUploadStatus('Uploading...');
    setBlobUrl(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Use the relative path for Vercel serverless function
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // If response is not ok (e.g., 500 error), read the error message from the body
        const errorText = await response.text();
        // Check if the response is JSON, if not use the raw text
        let errorMessage = errorText;
        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.error || errorText;
        } catch (e) {
            // response was not JSON, use the plain text
        }
        
        throw new Error(`Server Error: ${response.status} - ${errorMessage}`);
      }

      // Vercel Blob API returns the URL of the uploaded blob
      const result = await response.json();
      
      setBlobUrl(result.url);
      setUploadStatus('Upload Successful!');
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus(`UPLOAD FAILED: ${error.message || error.toString()}`);
    } finally {
      setIsLoading(false);
      setFile(null); // Clear file input
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus('');
  };

  return (
    <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl">
      <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 border-b-2 pb-3">
        Vercel Blob Image Uploader
      </h1>
      
      <form onSubmit={handleUpload} className="space-y-6">
        <div className="flex flex-col space-y-2">
          <label htmlFor="file-input" className="text-sm font-medium text-gray-700">
            Choose Image File
          </label>
          <input
            id="file-input"
            type="file"
            onChange={handleFileChange}
            disabled={isLoading}
            className="block w-full text-sm text-gray-900 
                       file:mr-4 file:py-2 file:px-4 
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-indigo-50 file:text-indigo-700
                       hover:file:bg-indigo-100"
          />
        </div>

        <button
          type="submit"
          disabled={!file || isLoading}
          className={`w-full py-3 px-4 rounded-xl text-white font-bold transition duration-150 ease-in-out shadow-lg 
            ${!file || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl'}`}
        >
          {isLoading ? 'Processing...' : 'Upload Image'}
        </button>
      </form>

      {uploadStatus && (
        <p className={`mt-4 p-3 rounded-lg text-sm font-semibold ${
          uploadStatus.includes('SUCCESS') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {uploadStatus}
        </p>
      )}

      {blobUrl && (
        <div className="mt-6 border-t pt-4 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Uploaded Image</h2>
          <img 
            src={blobUrl} 
            alt="Uploaded Blob" 
            className="w-full h-auto max-h-64 object-contain rounded-lg border border-gray-200"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x150/EEEEEE/31363F?text=Error+Loading+Image"; }}
          />
          <p className="text-xs text-gray-500 truncate">
            URL: <a href={blobUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">{blobUrl}</a>
          </p>
        </div>
      )}
    </div>
  );
};

// Re-export the component under the name Uploader for the main render call
export default UploaderComponent;