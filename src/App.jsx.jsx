// src/App.jsx
import { useState } from "react";

const gallery = [
  { id: 1, title: "Art 1", category: "Painting", src: "/images/art1.jpg" },
  { id: 2, title: "Art 2", category: "Drawing", src: "/images/art2.jpg" },
  { id: 3, title: "Art 3", category: "Digital", src: "/images/art3.jpg" },
  { id: 4, title: "Art 4", category: "Painting", src: "/images/art4.jpg" }
];

export default function App() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 20, background: "#f7f7f7", minHeight: "100vh", maxWidth: "1200px", margin: "0 auto", width: "95%" }}>
      <header style={{ maxWidth: 1100, margin: "0 auto 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0 }}>Ajith — Artwork</h1>
          <div style={{ color: "#666", marginTop: 6 }}>Originals, prints, and studies</div>
        </div>
        <div>
          <a href="mailto:you@domain.com" style={{ color: "#111", textDecoration: "none", border: "1px solid #ddd", padding: "8px 12px", borderRadius: 8 }}>Contact</a>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto" }}>
        <section>
          <h2 style={{ margin: "8px 0 6px" }}>Gallery</h2>
          <p style={{ color: "#666", marginTop: 0 }}>Click any image to view larger.</p>

          <div style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            marginTop: 12
          }}>
            {gallery.map(item => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
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
        </section>
      </main>

      <footer style={{ maxWidth: 1100, margin: "40px auto 20px", color: "#888", fontSize: 13 }}>
        © {new Date().getFullYear()} Ajith — All rights reserved
      </footer>

      {selected && (
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
    </div>
  );
}
