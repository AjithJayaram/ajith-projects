import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // This line tells it to load your App.jsx file
import './index.css' // This loads the basic styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)