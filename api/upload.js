// Vercel Serverless Function (Node.js) to handle file upload to Vercel Blob Store.

import { put } from '@vercel/blob';

// Helper function to convert the incoming request body (readable stream) 
// into a Buffer and extract the file data.
async function getFileFromRequest(request) {
  // Check for the presence of the required environment variable
  // This is the most important check!
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('Server Configuration Error: The secret key is not correctly loaded.');
  }

  // Use the standard Web API for handling form data
  const formData = await request.formData();
  // Get the file using the name 'file' (the name we gave it in the front-end)
  const file = formData.get('file');

  if (!file) {
    throw new Error('No file part in the request. The front-end did not send the file correctly.');
  }

  // The 'file' object from formData is a File, which can be converted to a buffer
  const buffer = await file.arrayBuffer();

  return { 
    buffer: Buffer.from(buffer), 
    filename: file.name,
    contentType: file.type
  };
}


// Main Serverless Function Export
export default async function handler(request, response) {
  if (request.method !== 'POST') {
    // Only allow POST requests for uploading files
    response.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { buffer, filename, contentType } = await getFileFromRequest(request);

    // Call the Vercel Blob API 'put' function
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: contentType,
      addRandomSuffix: true, // Ensures unique filename
    });

    // Successfully uploaded, send back the public URL
    response.status(200).json({ url: blob.url });
  } catch (error) {
    console.error('Blob upload failed:', error);
    // Send a 500 error response with the specific error message
    response.status(500).json({ error: error.message || 'Internal Server Error during Blob processing.' });
  }
}