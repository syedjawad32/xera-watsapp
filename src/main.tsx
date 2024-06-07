import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes , Route, useParams } from 'react-router-dom';
import App from './App.tsx';
import LandlordDetailPage from './components/LandlordDetailPage.tsx';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

const RouteRenderer = () => {
  const { id } = useParams<{ id: string | undefined }>(); // Specify the type for useParams
  const selectedLandlordId = parseInt(id || "0"); // Use optional chaining or fallback value

  return <LandlordDetailPage selectedLandlordId={selectedLandlordId} />;
};
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {/* Render RouteRenderer component within Route */}
        <Route path="/landlord/:id" element={<RouteRenderer />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);


