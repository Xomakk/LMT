import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import BASE_URL from './const';

export const fetchSingleLearningDirection = createAsyncThunk(
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

            const response = await fetch(`${BASE_URL}directions/${id}/`, requestOptions)
            
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
};

const singleLearningDirectionSlice = createSlice({
    name: 'singleLearningDirection',
    initialState: {
        singleLearningDirection: null,
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
        [fetchSingleLearningDirection.pending]: (state) => {
            state.status = 'loading';
            state.error = null;
        },
        [fetchSingleLearningDirection.fulfilled]: (state, action) => {
            state.status = 'resolved';
            state.singleLearningDirection = action.payload;
        },
        [fetchSingleLearningDirection.rejected]: setError,
        // [toggleStatus.rejected]: setError,
    },
});

// const {addGroup, toggleComplete, removeGroup} = todoSlice.actions;

export default singleLearningDirectionSlice.reducer;