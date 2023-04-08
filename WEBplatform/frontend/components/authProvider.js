
import { AuthContext } from "@/pages/_app";
import { LOGIN_PAGE, REGISTRATION_PAGE, endpoint } from "@/utils/constants";
import { useRouter } from "next/router";
import React from "react";

const AuthProvider = ({ children }) => {
    const router = useRouter();
    const [authorized, setAuthorized] = React.useState(false);


    React.useEffect(() => {
        authCheck(router.asPath);

        // const hideContent = () => setAuthorized(false);
        // router.events.on('routeChangeStart', hideContent);
        router.events.on('routeChangeComplete', authCheck)

        return () => {
            // router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }
    }, []);


    async function authCheck(url) {
        const response = await fetch(`${endpoint}/authenticated/`)
        const data = await response.json()
        console.log(data)

        const publicPaths = [
            LOGIN_PAGE, 
            REGISTRATION_PAGE
        ];
        const path = url.split('?')[0];
        if (!(data.isAuthenticated === "success") && !publicPaths.includes(path)) {
            setAuthorized(false);
            router.push({
                pathname: '/login',
                query: { returnUrl: router.asPath }
            });
        } else {
            setAuthorized(true);
        }
    }

    return (authorized && children);
};


export default AuthProvider;