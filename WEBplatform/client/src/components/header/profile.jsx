import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hook/useAuth'
import { fetchCurrentUser, logout } from '../../store/authSlice';


function Profile() {
    const navigate = useNavigate();
    const user = useSelector(state => state.currentUser.user);
    const dispatch = useDispatch();

    const handleClick = (event) => {
        if (!user) {
            navigate('/login', {replace: true});
        } else {
            dispatch(logout())
            navigate('/login', {replace: true});
        }
    };

    // {
    //     "id":1,
    //     "username":"admin",
    //     "email":"admin@mail.ru",
    //     "is_active":true,
    //     "is_superuser":true,
    //     "is_staff":true,
    //     "name":"Илья",
    //     "lastname":"Козлобродов",
    //     "groups":[],
    //     "learningDirections":[1]
    // }

    // if (!user) {
    //     return(
    //         <div className="profile-box">
    //             <a className="profile-box__img">
    //                 <img src="#" />
    //             </a>
    //             <a className="profile-box__label" onClick={handleClick}>
    //                 Авторизоваться
    //             </a>
    //         </div>
    //     );
    // } else {
        return(
            <>
                {user &&
                    <div className="profile-box" onClick={handleClick}>
                        <a className="profile-box__img">
                            <img src="#" />
                        </a>
                        <a className="profile-box__label">
                            {`${user.name} ${user.lastname}`}
                        </a>
                    </div>
                }

                {!user && 
                    <div className="profile-box" onClick={handleClick}>
                        <a className="profile-box__img">
                            <img src="#" />
                        </a>
                        <a className="profile-box__label">
                            Авторизоваться
                        </a>
                    </div>
                }
            </>
        );
    // }
};

export default Profile;