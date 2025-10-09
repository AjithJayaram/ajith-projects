// src/App.jsx
import { useState } from "react";

const gallery = [
  { id: 1, title: "Art 1", category: "Painting", src: "/images/art1.jpg" },
  { id: 2, title: "Art 2", category: "Drawing", src: "/images/art2.jpg" },
  { id: 3, title: "Art 3", category: "Digital", src: "/images/art3.jpg" },
  { id: 4, title: "Art 4", category: "Painting", src: "/images/art4.jpg" },
  { id: 5, title: "Art 5", category: "Mixed Media", src: "/images/art5.jpg" },
  { id: 6, title: "Art 6", category: "Oil", src: "/images/art6.jpg" },
  { id: 7, title: "Art 7", category: "Watercolor", src: "/images/art7.jpg" },
  { id: 8, title: "Art 8", category: "Study", src: "/images/art8.jpg" }
];

export default function App() {
  const [selected, setSelected] = useState(null);

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
        <h2>Gallery</h2>
        <p style={{ color: "#666", marginTop: 0 }}>Click any image to view larger.</p>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginTop: 12 }}>
          {gallery.map(item => (
           <button
  key={item.id}
  onClick={() => setSelected(item)}
  className="gallery-item"
  style={{ padding: 0, border: "none", background: "#fff", borderRadius: 8, overflow: "hidden", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
>
  <div style={{ width: "100%", aspectRatio: "1 / 1", background: "#eee" }}>
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
