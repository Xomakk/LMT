import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import BASE_URL from './const';

export const fetchLogin = createAsyncThunk(
    'currentUser/fetchLogin',
    async function({email, password}, {rejectWithValue, dispatch}) {
        try {
            // запрашиваем токены
            var formdata = new FormData();
            formdata.append("email", email);
            formdata.append("password", password);

            var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
            };

            const responseTokens = await fetch(`${BASE_URL}token/`, requestOptions)
            
            if (!responseTokens.ok) {
                throw new Error('Server Error!');
            }
    
            const TokensData = await responseTokens.json();


            // получаем инфу о текущем юзере
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${TokensData.access}`);

            var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
            };

            const responseUser = await fetch(`${BASE_URL}me/`, requestOptions)
            
            if (!responseUser.ok) {
                throw new Error('Server Error!');
            }
    
            const UserData = await responseUser.json();

            return {access: TokensData.access, refresh: TokensData.refresh, user: UserData};

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateToken = createAsyncThunk(
    'currentUser/updateToken',
    async function(_, {rejectWithValue, dispatch, getState}) {
        const access_token = getState().currentUser.access_token;
        const refresh_token = getState().currentUser.refresh_token;

        try {
            if (access_token) {
                const jwt = JSON.parse(atob(access_token.split('.')[1], 'base64'));
                const timed = jwt && jwt.exp && jwt.exp * 1000 || null;
                if (Date.now() > timed) {
                    var formdata = new FormData();
                    formdata.append("refresh", refresh_token)

                    console.log('токен обновлен')

                    const updatedToken = await fetch(`${BASE_URL}token/refresh/`, {
                            method: 'POST',
                            body: formdata
                        })
                    
                    if (!updatedToken.ok) {
                        throw new Error('Server Error!');
                    }
            
                    const token = await updatedToken.json();

                    localStorage.setItem('access_token', JSON.stringify(token.access))
                    dispatch(updateAccessToken(token.access))
                }
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }

    }
);

export const checkToken = createAsyncThunk(
    'currentUser/checkToken',
    async function(_, {rejectWithValue, dispatch, getState}) {
        const access_token = getState().currentUser.access_token;
        // console.log('токен из стейта', access_token)

        // обновляем токен, если просрочился
        updateToken();

        if (access_token) {
            try {
                // получаем инфу о текущем юзере
                var myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${access_token}`);

                var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
                };

                const responseUser = await fetch(`${BASE_URL}me/`, requestOptions)
                
                if (!responseUser.ok) {
                    throw new Error('Server Error!');
                }
        
                const UserData = await responseUser.json();
        
                dispatch(setUser({user: UserData}));
            } catch (error) {
                return rejectWithValue(error.message);
            }
        }
    }
)

export const logout = createAsyncThunk(
    'currentUser/logout',
    async function(_, {dispatch}) {
        dispatch(logoutUser(null))
    }
)
// export const deleteGroup = createAsyncThunk(
//     'groups/deleteGroup',
//     async function(id, {rejectWithValue, dispatch}) {
//         try {
//             const response = await fetch(`https://jsonplaceholder.typicode.com/groups/${id}`, {
//                 method: 'DELETE',
//             })

//             if (!response.ok) {
//                 throw new Error('Can\'t delete task. Server error.');
//             }

//             dispatch(removeGroup({id}));

//         } catch (error) {
//             return rejectWithValue(error.message);
//         }
//     }
// );

// export const toggleStatus = createAsyncThunk(
//     'groups/toggleStatus',
//     async function (id, {rejectWithValue, dispatch, getState}) {
//         const todo = getState().groups.groups.find(todo => todo.id === id);

//         try {
//             const response = await fetch(`https://jsonplaceholder.typicode.com/groups/${id}`, {
//                 method: 'PATCH',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     completed: !todo.completed,
//                 })
//             });

//             if (!response.ok) {
//                 throw new Error('Can\'t toggle status. Server error.');
//             }

//             dispatch(toggleComplete({id}));

//         } catch (error) {
//             return rejectWithValue(error.message)
//         }
//     }
// );

// export const addNewGroup = createAsyncThunk(
//     'groups/addNewGroup',
//     async function (text, {rejectWithValue, dispatch}) {
//         try {
//             const todo = {
//                 title: text,
//                 userId: 1,
//                 completed: false,
//             };

//             const response = await fetch('https://jsonplaceholder.typicode.com/groups', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(todo)
//             });

//             if (!response.ok) {
//                 throw new Error('Can\'t add task. Server error.');
//             }

//             const data = await response.json();
//             dispatch(addGroup(data));

//         } catch (error) {
//             return rejectWithValue(error.message);
//         }
//     }
// );

const setError = (state, action) => {
    state.status = 'rejected';
    state.error = action.payload;
}

const loginSlice = createSlice({
    name: 'currentUser',
    initialState: {
        user: null,
        access_token: JSON.parse(localStorage.getItem('access_token')) || null,
        refresh_token: JSON.parse(localStorage.getItem('refresh_token')) || null,
        status: null,
        error: null,
    },
    reducers: {
        updateAccessToken(state, action) {
            state.access_token = action.payload
        },

        setUser(state, action) {
            state.user = action.payload.user;
            state.status = 'resolved';
        },

        logoutUser(state, action) {
            state.user = action.payload;
            state.access_token = action.payload;
            state.refresh_token = action.payload;
            state.status = action.payload;
            state.error = action.payload;
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        },

        // addGroup(state, action) {
        //     state.groups.push(action.payload);
        // },
        // toggleComplete(state, action) {
        //     const toggledGroup = state.groups.find(todo => todo.id === action.payload.id);
        //     toggledGroup.completed = !toggledGroup.completed;
        // },
        // removeGroup(state, action) {
        //     state.groups = state.groups.filter(todo => todo.id !== action.payload.id);
        // }
    },
    extraReducers: {
        [fetchLogin.pending]: (state) => {
            state.status = 'loading';
            state.error = null;
        },
        [fetchLogin.fulfilled]: (state, action) => {
            state.status = 'resolved';

            localStorage.setItem('access_token', JSON.stringify(action.payload.access))
            localStorage.setItem('refresh_token', JSON.stringify(action.payload.refresh))

            state.access_token = action.payload.access;
            state.refresh_token = action.payload.refresh;
            state.user = action.payload.user;
        },
        [fetchLogin.rejected]: setError,

        // [checkToken.pending]: (state) => {
        //     console.log("загрузка")
        //     state.status = 'loading';
        //     state.error = null;
        // },

        // [checkToken.fulfilled]: (state, action) => {
        //     state.user = action.payload.user;
        //     state.access_token = action.payload.access;
        //     state.refresh_token = action.payload.refresh;
        //     state.status = 'resolved';
        // },

        // [checkToken.rejected]: setError,
    },
});

const {updateAccessToken, logoutUser, setUser} = loginSlice.actions;

export default loginSlice.reducer;