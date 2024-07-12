import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation, useParams } from 'react-router-dom';
import App from './App.tsx';
import Navbar from './components/Navbar.tsx';
import LandlordDetailPage from './components/LandlordDetailPage.tsx';
import 'bootstrap/dist/css/bootstrap.css';
import { ChakraProvider } from '@chakra-ui/react';
import './index.css';

const RouteRenderer = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get("page") || "0", 10);
  const { id } = useParams<{ id: string }>();
  const selectedLandlordId = id ? parseInt(id, 10) : null;

  return selectedLandlordId ? (
    <LandlordDetailPage selectedLandlordId={selectedLandlordId} page={page} />
  ) : (
    <App page={page} />
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<RouteRenderer />} />
          <Route path="/landlord/:id" element={<RouteRenderer />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
);

