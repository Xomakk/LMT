import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import BASE_URL from './const';

export const fetchLearningDirections = createAsyncThunk(
    'groups/fetchGroups',
    async function(_, {rejectWithValue}) {
        try {
            const access_token = JSON.parse(localStorage.getItem('access_token'))
            // console.log('Токен в срезе группы:', access_token)
            // получаем инфу о текущем юзере
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${access_token}`);

            var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
            };

            const response = await fetch(`${BASE_URL}directions/`, requestOptions)
            
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

export const fetchAddLearningDirections = createAsyncThunk(
    'groups/fetchGroups',
    async function(_, {rejectWithValue}) {
        try {
            const access_token = JSON.parse(localStorage.getItem('access_token'))
            // console.log('Токен в срезе группы:', access_token)
            // получаем инфу о текущем юзере
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${access_token}`);

            var formdata = new FormData();
            formdata.append("name", num);
            formdata.append("courseDuration", topic);
            formdata.append("methodical_material", methodical);

            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
            };

            const response = await fetch(`${BASE_URL}directions/`, requestOptions)
            
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


const setError = (state, action) => {
    state.status = 'rejected';
    state.error = action.payload;
}

const learningDirectionsSlice = createSlice({
    name: 'learningDirections',
    initialState: {
        learningDirections: null,
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
        [fetchLearningDirections.pending]: (state) => {
            state.status = 'loading';
            state.error = null;
        },
        [fetchLearningDirections.fulfilled]: (state, action) => {
            state.status = 'resolved';
            state.learningDirections = action.payload;
        },
        [fetchLearningDirections.rejected]: setError,
    },
});

// const {addGroup, toggleComplete, removeGroup} = todoSlice.actions;

export default learningDirectionsSlice.reducer;