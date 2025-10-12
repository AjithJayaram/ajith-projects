import { useState, useRef } from 'react';
// The problematic import for image upload has been permanently removed.

// Initial gallery data (now using a state variable in App)
const initialGallery = [
  { id: 1, title: "Art 1", category: "Painting", src: "/images/art1.jpg" },
  { id: 2, title: "Art 2", category: "Drawing", src: "/images/art2.jpg" },
  { id: 3, title: "Art 3", category: "Digital", src: "/images/art3.jpg" },
  { id: 4, title: "Art 4", category: "Painting", src: "/images/art4.jpg" },
  { id: 5, title: "Art 5", category: "Mixed Media", src: "/images/art5.jpg" },
  { id: 6, title: "Art 6", category: "Oil", src: "/images/art6.jpg" },
  { id: 7, title: "Art 7", category: "Watercolor", src: "/images/art7.jpg" },
  { id: 8, title: "Art 8", category: "Study", src: "/images/art8.jpg" }
];

// Helper component for the upload form
const UploadForm = ({ onUploadSuccess }) => {
  const inputFileRef = useRef(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Function rewritten to use standard fetch and FormData
  const handleUpload = async (event) => {
    event.preventDefault();

    const file = inputFileRef.current?.files[0];

    if (!file) {
      setMessage('Please select an image file first.');
      return;
    }

    setIsUploading(true);
    setMessage('Uploading file...');

    try {
      // 1. Use FormData to package the file for standard HTTP POST
      const formData = new FormData();
      // The key 'file' must match what the upload-proxy.js script expects
      formData.append('file', file); 
      formData.append('filename', file.name);

      // 2. Post the FormData directly to our proxy endpoint
      const response = await fetch('http://localhost:5173/api/upload', {
        method: 'POST',
        // IMPORTANT: Do NOT set Content-Type for FormData; the browser handles it.
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        // If the proxy returns an error, display it
        throw new Error(result.error || 'Upload failed due to a server error.');
      }
      
      // The result contains the final Vercel Blob URL (result.url)
      const newBlobUrl = result.url; 

      setMessage(`✅ Upload successful! ${file.name} is now in the gallery.`);
      
      // Reset the file input
      inputFileRef.current.value = null;

      // Add the new artwork to the gallery state
      onUploadSuccess({
        id: Date.now(),
        title: file.name.split('.').slice(0, -1).join('.'),
        category: "Uploaded",
        src: newBlobUrl,
      });

    } catch (error) {
      console.error(error);
      setMessage(`❌ Upload failed: ${error.message || 'Check console for details.'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px', background: '#fff' }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#111' }}>Upload New Artwork</h3>
      <form onSubmit={handleUpload} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input 
          name="file" 
          ref={inputFileRef} 
          type="file" 
          required 
          accept="image/jpeg,image/png,image/webp"
          disabled={isUploading}
          style={{ flexGrow: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button 
          type="submit" 
          disabled={isUploading}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: isUploading ? '#ccc' : '#007bff', // Use a friendly blue color
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: isUploading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isUploading ? 'Processing...' : 'Upload Image'}
        </button>
      </form>
      {message && <p style={{ marginTop: '10px', fontSize: '14px', color: message.startsWith('❌') ? 'red' : '#007bff' }}>{message}</p>}
    </div>
  );
};


// Main App Component
export default function App() {
  // Use state for the gallery so we can add new items
  const [gallery, setGallery] = useState(initialGallery);
  const [selected, setSelected] = useState(null);

  // Function to update the gallery with a new uploaded piece
  const handleNewUpload = (newArt) => {
    // Add the new art to the beginning of the gallery list
    setGallery(prevGallery => [newArt, ...prevGallery]);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 20, background: "#f7f7f7", minHeight: "100vh", maxWidth: "1200px", margin: "0 auto", width: "95%" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, color: "#111" }}>Ajith — Artwork</h1>
          <div style={{ color: "#666", marginTop: 6 }}>Originals, prints, and studies</div>
        </div>

        {/* Contact button opens popup */}
        <div>
          <button
            onClick={() => setSelected({ contact: true })}
            style={{
              color: "#fff",
              background: "#111",
              border: "none",
              padding: "8px 14px",
              borderRadius: 8,
              cursor: "pointer"
            }}
          >
            Contact
          </button>
        </div>
      </header>

      <main style={{ marginTop: 20 }}>
        
        {/* The functional Upload Form component is now added here */}
        <UploadForm onUploadSuccess={handleNewUpload} />

        <h2>Gallery</h2>
        <p style={{ color: "#666", marginTop: 0 }}>Click any image to view larger. Newly uploaded art appears at the top.</p>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginTop: 12 }}>
          {gallery.map(item => (
           <button
             key={item.id}
             onClick={() => setSelected(item)}
             className="gallery-item"
             style={{ padding: 0, border: "none", background: "#fff", borderRadius: 8, overflow: "hidden", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", transition: 'transform 0.2s' }}
           >
             <div style={{ width: "100%", aspectRatio: "1 / 1", background: "#eee" }}>
               {/* This handles both the initial local images and the uploaded URLs */}
               <img src={item.src} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
             </div>
             <div style={{ padding: 8 }}>
               <div style={{ fontSize: 14, fontWeight: 600 }}>{item.title}</div>
               <div style={{ fontSize: 12, color: "#666" }}>{item.category}</div>
             </div>
           </button>
          ))}
        </div>
      </main>

      <footer style={{ marginTop: 40, color: "#888", fontSize: 13 }}>© {new Date().getFullYear()} Ajith — All rights reserved</footer>

      {/* Lightbox for images */}
      {selected && selected.id && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 60
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: "90%", maxHeight: "90%", background: "#fff", borderRadius: 8, overflow: "hidden" }}>
            <img src={selected.src} alt={selected.title} style={{ width: "100%", height: "auto", display: "block", maxHeight: "70vh", objectFit: "contain", background: "#f2f2f2" }} />
            <div style={{ padding: 12 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{selected.title}</div>
              <div style={{ color: "#666", marginTop: 6 }}>{selected.category} • Size: — • Medium: —</div>
              <div style={{ marginTop: 10 }}>
                <button onClick={() => setSelected(null)} style={{ padding: "8px 12px", borderRadius: 6, border: "none", background: "#111", color: "#fff", cursor: "pointer" }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact popup (when Contact button pressed) */}
      {selected && selected.contact && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 70
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 10, padding: 20, maxWidth: 320, width: "90%", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.15)" }}>
            <h2 style={{ marginTop: 0 }}>Contact MEEEEEEE</h2>
            <p style={{ margin: "8px 0" }}>📞 +966 555 318 426</p>
            <p style={{ margin: "8px 0" }}>✉️ jayaramajith@outlook.com</p>
            <p style={{ margin: "8px 0", color: "#555" }}>📍 Riyadh, Saudi Arabia</p>
            <p style={{ marginTop: 16, fontSize: 14, color: "#666" }}>Available for IT projects and creative collaborations.</p>
            <button onClick={() => setSelected(null)} style={{ marginTop: 16, padding: "8px 14px", border: "none", borderRadius: 6, background: "#111", color: "#fff", cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}