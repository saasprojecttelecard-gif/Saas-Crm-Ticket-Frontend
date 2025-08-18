import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminLayout from '@saas-crm/shared/AdminLayout';
import TicketPage from './pages/TicketPage';


function App() {
    localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkI…U0OH0.Z4Vc2VAXDHH1xEDRb3EFTwVi7zxe3F-oGTDSuEMS8hk')
    return (
        <div className="App">
            <BrowserRouter basename='tickets'>
                <AdminLayout>
                    <Routes>
                        <Route path="/" element={<TicketPage />} />
                    </Routes>
                </AdminLayout>
            </BrowserRouter>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        theme: {
                            primary: 'green',
                            secondary: 'black',
                        },
                    },
                    error: {
                        duration: 5000,
                        theme: {
                            primary: 'red',
                            secondary: 'black',
                        },
                    },
                }}
            />
        </div>
    );
}

export default App;
