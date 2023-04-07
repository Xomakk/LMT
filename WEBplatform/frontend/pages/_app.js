import Layout from '@/components/Layout';
import AuthProvider from '@/components/authProvider';
import '@/styles/globals.scss'
import { useRouter } from 'next/router';
import React from 'react';
import { SSRProvider } from 'react-bootstrap';


export const AuthContext = React.createContext();


const App = ({ Component, pageProps }) => {
    const [authToken, setAuthToken] = React.useState();
    const [user, setUser] = React.useState();

    return (
        <AuthContext.Provider value={{authToken, setAuthToken, user, setUser}}>
            <SSRProvider>
                <Layout>
                    <AuthProvider>
                        <Component {...pageProps} />
                    </AuthProvider>
                </Layout>
            </SSRProvider>
        </AuthContext.Provider>
)};

export default App;