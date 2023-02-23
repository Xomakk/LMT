import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hook/useAuth'
import { fetchLogin } from '../store/authSlice';

export default function LoginPage() {
    const location = useLocation();

    const fromPage = location.state?.from?.pathname || '/';

    const {status, error} = useSelector(state => state.currentUser);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;

        dispatch(fetchLogin({email: form.email.value, password: form.password.value}))
        
        console.log('авторизовался успешно')
    };

    useEffect(() => {
        if (status  === 'resolved' ) {
            navigate(fromPage, {replace: true});
        }
     }, [status]);

  return(
        <div className="form-containter">
            <div className="form-box">
                <form onSubmit={handleSubmit} className="form">
                    <div className='form__input-box'>
                        <input type="text" name='email' className="form__username form-input"/>
                        <p className="form__label input-label">Email</p>
                    </div>
                    <div className='form__input-box'>
                        <input type="password" name='password' className="form__password form-input"/>
                        <p className="form__label input-label">Пароль</p>
                    </div>
                    <div className="form__row">
                        <div className='form__input-box remember-me-box'>
                            <input type="checkbox" className="form__remember-me"/>
                            <p className="form__label remember-me-label">Запомнить меня</p>
                        </div>
                        {/* <Link to='/singup' className='form__reset-password-link form__label'>Забыли пароль?</Link> */}
                    </div>
                    <button type='submit' className='form__button'>Войти</button>
                    <p className="form__label">Еще не создавали аккаунт? <Link to='/signup'>Зарегистрироваться</Link></p>
                </form>
            </div>
        </div>
    );
};
