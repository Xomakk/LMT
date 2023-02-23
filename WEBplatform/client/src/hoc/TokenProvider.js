export const createTokenProvider = () => {

    // let _token = localStorage.getItem('REACT_TOKEN_AUTH') || null;
    // console.log(`_token: ${_token}`)

    // let _token = JSON.parse(localStorage.getItem('REACT_TOKEN_AUTH') || '') || null;
    let _token = localStorage.getItem('REACT_TOKEN_AUTH') || null;
    // let _currentUser = localStorage.getItem('CURRENT_USER') || null;

    if (_token) {
        _token = JSON.parse(_token)
        // _currentUser = JSON.parse(_currentUser)
    }

    // console.log('Token: ', _token)

    const getExpirationDate = (jwtToken) => {
        if (!jwtToken) {
            return null;
        }

        const jwt = JSON.parse(atob(jwtToken.split('.')[1], 'base64'));
        // multiply by 1000 to convert seconds into milliseconds
        return jwt && jwt.exp && jwt.exp * 1000 || null;
    };

    const isExpired = (exp) => {
        if (!exp) {
            return false;
        }

        return Date.now() > exp;
    };

    const getToken = async () => {
        if (!_token) {
            return null;
        }

        var formdata = new FormData();
            formdata.append("refresh", _token.refresh)

        // console.log(`Проверяю токен.`)
        if (isExpired(getExpirationDate(_token.access))) {
            var formdata = new FormData();
            formdata.append("refresh", _token.refresh)

            const updatedToken = await fetch('http://127.0.0.1:8000/api/v1/token/refresh/', {
                    method: 'POST',
                    body: formdata
                })
                    .then(r => r.json());
            // console.log(updatedToken)
            const token = {
                "refresh": _token.refresh,
                "access": updatedToken.access,
            };
            setToken(token);
        }
        return _token && _token.access;
    };



    // const getCurrentUser = async () => {
    //     if (isLoggedIn()) {
    //         return _currentUser
    //     };
    //     return null;
    // };

    const isLoggedIn = () => {
        return !!_token;
    };

    let observers = [];

    const subscribe = (observer) => {
        observers.push(observer);
    };

    const unsubscribe = (observer) => {
        observers = observers.filter(_observer => _observer !== observer);
    };

    const notify = () => {
        const isLogged = isLoggedIn();
        observers.forEach(observer => observer(isLogged));
    };

    const setToken = (token) => {
        if (token) {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token.access}`);

            var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
            };

            fetch("http://127.0.0.1:8000/api/v1/me/", requestOptions)
                .then(async response => 
                    {
                    const isJson = response.headers.get('content-type')?.includes('application/json');
                    const profileData = isJson && await response.json();

                    if (!response.ok) {
                        alert('Введеные неверные данные или нет связи с сервером.')
                        // get error message from body or default to response status
                        const error = (profileData && profileData.message) || response.status;
                        return Promise.reject(error);
                    }
                    localStorage.setItem('CURRENT_USER', JSON.stringify(profileData))
                    })
                .catch(error => console.log('error', error));

            localStorage.setItem('REACT_TOKEN_AUTH', JSON.stringify(token));
        } else {
            localStorage.removeItem('REACT_TOKEN_AUTH');
            localStorage.removeItem('CURRENT_USER');
        }
        _token = token
        notify();
    };

    return {
        getToken,
        isLoggedIn,
        setToken,
        subscribe,
        unsubscribe,
        // getCurrentUser,
    };
};