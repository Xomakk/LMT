
import { AuthContext } from "@/pages/_app";
import { LOGIN_PAGE, REGISTRATION_PAGE, endpoint } from "@/utils/constants";
import { useRouter } from "next/router";
import React from "react";
import { getAuthToken, getUserData } from "./auth";

const AuthProvider = ({ children }) => {
    const { authToken, user, setUser, setAuthToken } = React.useContext(AuthContext);
    const router = useRouter();
    const [authorized, setAuthorized] = React.useState(false);

    React.useEffect(() => {
        setAuthToken(getAuthToken())

        authCheck(router.asPath);

        const hideContent = () => setAuthorized(false);
        router.events.on('routeChangeStart', hideContent);
        router.events.on('routeChangeComplete', authCheck)

        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }
    }, []);

    async function authCheck(url) {
        const publicPaths = [
            LOGIN_PAGE, 
            REGISTRATION_PAGE
        ];
        const path = url.split('?')[0];

        if (!getAuthToken() && !publicPaths.includes(path)) {
            setAuthorized(false);
            router.push('/login');
        } else {
            setAuthorized(true);
        }
    }

    return (authorized && children);
};


export default AuthProvider;