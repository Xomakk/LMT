import { useRouter } from "next/router";
import { useEffect } from "react";


const Error = () => {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push('/')
        }, 3000)
    }, [])

    return (
        <>
            <h1>Ошибка 404. Страница не найдена.</h1>
            <p>Вы будете перенаправлены на главную страницу через 3 секунды...</p>
        </>
    );
};


export default Error;