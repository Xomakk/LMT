import { createContext, useEffect, useState } from "react";
import { createTokenProvider } from "./TokenProvider";

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const tokenProvider = createTokenProvider();

    const authFetch = async (url, init) => {
        const token = await tokenProvider.getToken();

        if (token) {
            init = init || {};

            init.headers = {
                ...init.headers,
                Authorization: `Bearer ${token}`,
            };
            // console.log(`http://127.0.0.1:8000/api/v1/${url}`, token)
        }

        return fetch(`http://127.0.0.1:8000/api/v1/${url}`, init);
    };

    const useCheckAuth = () => {
        const [isLogged, setIsLogged] = useState(tokenProvider.isLoggedIn());

        useEffect(() => {
            const listener = (newIsLogged) => {
                setIsLogged(newIsLogged);
            };

            tokenProvider.subscribe(listener);
            return () => {
                tokenProvider.unsubscribe(listener);
            };
        }, []);

        return isLogged;
    };

    const signin = (newToken, callback) => {
        tokenProvider.setToken(newToken);
        callback();
        // console.log(`Токен ${newToken} сохранен`)
    };

    const signout = (callback) => {
        // var myHeaders = new Headers();
        // var formdata = new FormData();

        // var requestOptions = {
        // method: 'POST',
        // headers: myHeaders,
        // body: formdata,
        // redirect: 'follow'
        // };

        // authFetch("auth/token/logout/", requestOptions)
        //     .then(response => response.text())
        //     .then(result => console.log(result))
        //     .catch(error => console.log('error', error));
        tokenProvider.setToken(null);
        callback();
        // console.log('выход произведен')
    };

    const value = {tokenProvider, useCheckAuth, signin, signout, authFetch} 
    
    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
};
