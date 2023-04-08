import { endpoint, host } from "@/utils/constants";
import { getCookie } from "@/utils/functions";

export const signUp = async ({ data }) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", getCookie('csrftoken'));

    var raw = JSON.stringify({
        "email": data.email,
        "password": data.password
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const response = await fetch(`${endpoint}/auth/users/`, requestOptions)
    const responseData = await response.json()
    return responseData;
}


export const getUserData = async (token) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", getCookie('csrftoken'));
    myHeaders.append("X-CSRFToken", getCookie('csrftoken'));

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const response = await fetch(`${endpoint}/current_user/`, requestOptions)

    if (!response.ok) {
        throw new Error('Ошибка получения данных о пользователе. RESPONSE ERROR');
    }

    const user_data = await response.json()
    return user_data;
}


export const login = async (form_data) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Cookie", `csrftoken=${getCookie('csrftoken')}`);
    myHeaders.append("X-CSRFToken", getCookie('csrftoken'));
    console.log(getCookie('csrftoken'))


    var raw = JSON.stringify({
        "email": form_data.email,
        "password": form_data.password
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const response = await fetch(`${endpoint}/login/`, requestOptions)
    console.log(response.headers)
    const data = await response.json()

    if (!response.ok) {
        return data
    }
    
    var user_data = {}
    await getUserData()
    .then(data => user_data = data)

    return {
        user: user_data
    };
}


export const logout = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("X-CSRFToken", getCookie('csrftoken'));

    var raw = JSON.stringify({
        'withCredentials': true
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    await fetch(`${endpoint}/logout/`, requestOptions)
}
