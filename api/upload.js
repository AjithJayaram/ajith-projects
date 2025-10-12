// Vercel Serverless Function (Node.js/Edge Runtime) to handle file upload to Vercel Blob Store.

import { put } from '@vercel/blob';

// Helper function to extract the file data robustly.
async function getFileFromRequest(request) {
  // Check for the presence of the required environment variable
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('Server Configuration Error: The secret key is not correctly loaded.');
  }

  // Use the standard Web API method to get the file data from the request body.
  const formData = await request.formData();
  
  // Get the file using the name 'file' (the name we gave it in the front-end)
  const file = formData.get('file');

  if (!file) {
    throw new Error('No file part in the request.');
  }

  // Convert the file stream to a buffer for the Vercel Blob API
  const buffer = await file.arrayBuffer();

  return { 
    buffer: Buffer.from(buffer), 
    filename: file.name,
    contentType: file.type || 'application/octet-stream' // Fallback content type
  };
}


// Main Serverless Function Export
// This function must return a 'Response' object when using the Edge Runtime.
export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { buffer, filename, contentType } = await getFileFromRequest(request);

    // Call the Vercel Blob API 'put' function
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: contentType,
      addRandomSuffix: true, // Ensures unique filename
    });

    // Successfully uploaded, send back the public URL as a Response object
    return new Response(JSON.stringify({ url: blob.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Blob upload failed:', error);
    // Send a 500 error response with the specific error message
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error during Blob processing.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Configuration to force Vercel to use the Edge Runtime for improved file handling
export const config = {
  runtime: 'edge', 
};
