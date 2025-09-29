import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminLayout from '@saas-crm/shared/AdminLayout';
import { checkAuthAndRedirect } from '@saas-crm/shared/tokenHandler';
import TicketPage from './pages/TicketPage';


function App() {
    useEffect(() => {
        checkAuthAndRedirect();
        // 
    }, []);
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
