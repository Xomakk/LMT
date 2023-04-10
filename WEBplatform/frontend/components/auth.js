import { AuthContext } from "@/pages/_app";
import { endpoint, host } from "@/utils/constants";
import { getCookie } from "@/utils/functions";
import React from "react";

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


export const getUserData = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", getCookie('csrftoken'));
    myHeaders.append("Authorization", `Token ${getAuthToken()}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const response = await fetch(`${endpoint}/current_user/`, requestOptions)

    if (!response.ok) {
        if (response.status === 401) {
            return
        }
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

    const response = await fetch(`${endpoint}/auth/token/login/`, requestOptions)
    const data = await response.json()

    if (!response.ok) {
        return data
    }

    const token = data.auth_token

    localStorage.setItem('auth_token', token)
    
    return {
        token: token
    };
}


export const logout = async () => {
    localStorage.removeItem('auth_token')

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Cookie", `csrftoken=${getCookie('csrftoken')}`);

    var raw = JSON.stringify({
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    await fetch(`${endpoint}/auth/token/logout/`, requestOptions)
}



export const getAuthToken = () => {
    const token = localStorage.getItem('auth_token')
    return token;
}