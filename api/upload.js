// This function runs on the Vercel server when the front-end calls /api/upload

import { put } from '@vercel/blob';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false, 
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { file, filename } = await parseFormData(req);

        if (!file) {
            return res.status(400).json({ error: 'No file provided.' });
        }
        
        const blob = await put(filename, file, {
            access: 'public',
        });

        return res.status(200).json({ url: blob.url });

    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: 'Failed to upload image.', details: error.message });
    }
}


function parseFormData(req) {
    return new Promise((resolve, reject) => {
        const form = formidable({ 
            uploadDir: '/tmp',
            keepExtensions: true,
            maxFileSize: 10 * 1024 * 1024,
        });

        form.parse(req, (err, fields, files) => {
            if (err) {
                return reject(err);
            }

            const uploadedFile = files.file?.[0]; 
            const filename = fields.filename?.[0] || uploadedFile.originalFilename;

            if (uploadedFile) {
                const fileBuffer = fs.readFileSync(uploadedFile.filepath);
                fs.unlinkSync(uploadedFile.filepath);
                resolve({ file: fileBuffer, filename: filename });
            } else {
                resolve({ file: null, filename: filename });
            }
        });
    });
}