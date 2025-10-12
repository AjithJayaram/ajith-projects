// This file is the correct way to handle Vercel Blob security in a Vite project.
import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server'; // We still use NextResponse for the response format

// This function is what the upload button talks to for security checks.
export async function POST(request) {
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // SECURITY CHECK: only allow images to be uploaded
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
          addRandomSuffix: true, // adds a unique code to your filename
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // This runs after the file is saved on Vercel
        console.log(`Blob ${blob.pathname} upload complete.`);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 },
    );
  }
}