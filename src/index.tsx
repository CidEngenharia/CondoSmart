
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log("CondoSmart: Starting App mounting...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("CondoSmart: Root element not found!");
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("CondoSmart: App.render() called successfully");
} catch (error) {
  console.error("CondoSmart: Error during mounting:", error);
}
