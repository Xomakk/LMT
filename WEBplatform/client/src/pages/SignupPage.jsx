import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hook/useAuth'

export default function SignupPage() {
    // const [username, setUsername] = useState('');
    // const [password, setPassword] = useState('');
    // const [rememberMe, setRememberMe] = useState('off');

    const {signin} = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const fromPage = location.state?.from?.pathname || '/';

    const urlLogin = 'http://127.0.0.1:8000/auth/token/login/'

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        // ------------------------------- Registration -------------------------------------- //

        if (form.password.value !== form.password_repeat.value) {
            alert('Пароли не совпадают')
            return 
        }

        var formdata = new FormData();
            formdata.append("name", form.name.value);
            formdata.append("lastname", form.lastname.value);
            formdata.append("email", form.email.value);
            formdata.append("password", form.password.value);

        console.log(form.name.value)

        var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
        };

        fetch("http://127.0.0.1:8000/api/v1/auth/users/", requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();
                // check for error response
                if (!response.ok) {
                    alert('Введеные неверные данные или нет связи с сервером.')
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
            })

        // ------------------------------- logining -------------------------------------- //
        // var formdata = new FormData();
        // formdata.append("email", form.email.value);
        // formdata.append("password", form.password.value);

        // var requestOptions = {
        // method: 'POST',
        // body: formdata,
        // redirect: 'follow'
        // };

        // fetch("http://127.0.0.1:8000/auth/token/login/", requestOptions)
        // .then(async response => {
        //     const isJson = response.headers.get('content-type')?.includes('application/json');
        //     const data = isJson && await response.json();
        //     // check for error response
        //     if (!response.ok) {
        //         alert('Введеные неверные данные или нет связи с сервером.')
        //         // get error message from body or default to response status
        //         const error = (data && data.message) || response.status;
        //         return Promise.reject(error);
        //     }
        //     // console.log(data.auth_token)
        //     // navigate(fromPage, {replace: true})
        //     signin(data.auth_token, () => console.log('отправил токен'));

        // })
        // .catch(error => console.log('error', error));
    };



  return(
        <div className="form-containter">
            <div className="form-box">
                <form onSubmit={handleSubmit} className="form">
                    <div className='form__input-box'>
                        <input type="text" name='name' className="form__password form-input"/>
                        <p className="form__label input-label">Имя</p>
                    </div>
                    <div className='form__input-box'>
                        <input type="text" name='lastname' className="form__password form-input"/>
                        <p className="form__label input-label">Фамилия</p>
                    </div>
                    <div className='form__input-box'>
                        <input type="text" name='email' className="form__username form-input"/>
                        <p className="form__label input-label">Email</p>
                    </div>
                    <div className='form__input-box'>
                        <input type="password" name='password' className="form__password form-input"/>
                        <p className="form__label input-label">Пароль</p>
                    </div>
                    <div className='form__input-box'>
                        <input type="password" name='password_repeat' className="form__password form-input"/>
                        <p className="form__label input-label">Повтор пароля</p>
                    </div>
                    <div className="form__row">
                        <div className='form__input-box remember-me-box'>
                            <input type="checkbox" className="form__remember-me"/>
                            <p className="form__label remember-me-label">Запомнить меня</p>
                        </div>
                        {/* <Link to='/singup' className='form__reset-password-link form__label'>Забыли пароль?</Link> */}
                    </div>
                    <button type='submit' className='form__button'>Зарегистрироваться</button>
                    <p className="form__label">Уже есть аккаунт? <Link to='/login'>Войти</Link></p>
                </form>
            </div>
        </div>
    );
};
