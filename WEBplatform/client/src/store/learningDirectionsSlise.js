import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import BASE_URL from './const';

export const fetchLearningDirections = createAsyncThunk(
    'learningDirections/fetchLearningDirections',
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


async function CreateTimeTable(myHeaders, academic_hours) {
    var DateNow = new Date();
    
    var formdata = new FormData();
        formdata.append("year", DateNow.getFullYear());
        formdata.append("academic_hours", academic_hours);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    const response = await fetch(`${BASE_URL}timetable/`, requestOptions)
    return response
};


export const fetchAddLearningDirections = createAsyncThunk(
    'learningDirections/fetchAddLearningDirections',
    async function({name, courseDuration, academic_hours}, {rejectWithValue}) {
        try {
            const access_token = JSON.parse(localStorage.getItem('access_token'))
            // console.log('Токен в срезе группы:', access_token)
            // получаем инфу о текущем юзере
            var myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${access_token}`);

            const timeTable_response = CreateTimeTable(myHeaders, academic_hours)

            if (!timeTable_response.ok) {
                throw new Error('Server Error!');
            }

            const timeTable_data = await timeTable_response.json();
            console.log(timeTable_data)

            // var formdata = new FormData();
            //     formdata.append("name", name);
            //     formdata.append("courseDuration", courseDuration);
            //     formdata.append("timetable", timeTable_data.id);

            // var requestOptions = {
            //     method: 'POST',
            //     headers: myHeaders,
            //     body: formdata,
            //     redirect: 'follow'
            // };

            // const response = await fetch(`${BASE_URL}directions/`, requestOptions)
            
            // if (!response.ok) {
            //     throw new Error('Server Error!');
            // }
    
            // const data = await response.json();

            // return data;
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