import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes , Route, useParams } from 'react-router-dom';
import App from './App.tsx';
import Navbar from './components/Navbar.tsx';
import LandlordDetailPage from './components/LandlordDetailPage.tsx';
import 'bootstrap/dist/css/bootstrap.css';
import { ChakraProvider } from '@chakra-ui/react'
import './index.css';

const RouteRenderer = () => {
  const { id } = useParams<{ id: string | undefined }>(); 
  const selectedLandlordId = parseInt(id || "0"); 

  return <LandlordDetailPage selectedLandlordId={selectedLandlordId} />;
};
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <ChakraProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Navbar/><App/></>} />
        <Route path="/landlord/:id" element={<><Navbar/><RouteRenderer /></>} />
      </Routes>
    </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
);


