import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';
import { checkToken, updateToken } from '../store/authSlice';

export const RequireAuth = ({children}) => {
    const location = useLocation();
    const user = useSelector(state => state.currentUser.user);
    const dispatch = useDispatch();

    useEffect(
        () => {
            dispatch(updateToken());
        }, [dispatch]
    )

    if (!user) {
        dispatch(updateToken());
        dispatch(checkToken());
    }

    if (!user) {
        return <Navigate to='/login' state={{from: location}}/>
    }
    
    return children;
}
