import Header from '@/components/Header';
import Footer from '@/components/Footer';
import React from 'react';
import { AuthProvider } from '@/pages/_app';


const Layout = ({ children }) => {
    return (
    <>
        <Header body={children}/>
        {/* <Footer /> */}
    </>
)};


export default Layout;