import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import BASE_URL from './const';

export const fetchSingleGroup = createAsyncThunk(
    'groups/fetchSingleGroup',
    async function(id, {rejectWithValue}) {
        try {
            const access_token = JSON.parse(localStorage.getItem('access_token'))
            // console.log('Токен в срезе группы:', access_token)
            // получаем инфу о текущем юзере
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${access_token}`);

            var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            };

            const response = await fetch(`${BASE_URL}groups/${id}/`, requestOptions)
            
            if (!response.ok) {
                throw new Error('Server Error!');
            }
    
            const data = await response.json();

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

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

const singleGroupSlice = createSlice({
    name: 'singleGroup',
    initialState: {
        singleGroup: null,
        status: null,
        error: null,
    },
    reducers: {
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
        [fetchSingleGroup.pending]: (state) => {
            state.status = 'loading';
            state.error = null;
        },
        [fetchSingleGroup.fulfilled]: (state, action) => {
            state.status = 'resolved';
            state.singleGroup = action.payload;
        },
        [fetchSingleGroup.rejected]: setError,
        // [deleteGroup.rejected]: setError,
        // [toggleStatus.rejected]: setError,
    },
});

// const {addGroup, toggleComplete, removeGroup} = todoSlice.actions;

export default singleGroupSlice.reducer;