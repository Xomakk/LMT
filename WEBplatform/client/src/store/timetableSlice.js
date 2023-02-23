import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import BASE_URL from './const';
import { fetchLessons } from './lessonsSlice';
import { fetchSingleLearningDirection } from './SingleLearningDirectionSlice';

export const fetchTimetable = createAsyncThunk(
    'timetable/fetchTimetable',
    async function(id, {rejectWithValue, dispatch, getState}) {
        try {
                if (id) {
                const access_token = JSON.parse(localStorage.getItem('access_token'))
    
                var myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${access_token}`);
    
                var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                };
    
                const response = await fetch(`${BASE_URL}timetable/${id}/`, requestOptions)
                
                if (!response.ok) {
                    throw new Error('Server Error!');
                }
    
                const data = await response.json();
    
                dispatch(fetchLessons(data?.lessons))
    
                return data;
                }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAddTimetable = createAsyncThunk(
    'timetable/addtimetable',
    async function({ academic_hours }, {rejectWithValue, getState, dispatch}) {
        try {
            const access_token = JSON.parse(localStorage.getItem('access_token'))
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${access_token}`);

            var formdata = new FormData();
            formdata.append("academic_hours", academic_hours);

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
            };

            const response1 = await fetch(`${BASE_URL}timetable/`, requestOptions)

            if (!response1.ok) {
                throw new Error('Server Error!');
            }

            const data = await response1.json();

            let singleLearningDirection = getState().singleLearningDirection.singleLearningDirection;

            dispatch(fetchSingleLearningDirection(singleLearningDirection.id))

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// export const fetchChangeTimetable = createAsyncThunk(
//     'timetable/addtimetable',
//     async function({id, number, topic, methodical_material}, {rejectWithValue, getState, dispatch}) {
//         try {
            
//             const access_token = JSON.parse(localStorage.getItem('access_token'))
//             var myHeaders = new Headers();
//             myHeaders.append("Authorization", `Bearer ${access_token}`);
            
//             var formdata = new FormData();
//             console.log({id, number, topic, methodical_material})
//             formdata.append("number", number);
//             formdata.append("topic", topic);
//             formdata.append("methodical_material", methodical_material);

//             var requestOptions = {
//                 method: 'PUT',
//                 headers: myHeaders,
//                 body: formdata,
//                 redirect: 'follow'
//             };

//             const response = await fetch(`${BASE_URL}timetable/${id}/`, requestOptions)
            
//             if (!response.ok) {
//                 throw new Error('Server Error!');
//             }

//             let singleLearningDirection = getState().singleLearningDirection.singleLearningDirection
//             dispatch(fetchSingleLearningDirection(singleLearningDirection.id))
//         }
//         catch (error) {
//             return rejectWithValue(error.message);
//         }
//     }
// )

// export const fetchDeleteTimetable = createAsyncThunk(
//     'timetable/addtimetable',
//     async function(id, {rejectWithValue, getState, dispatch}) {
//         try {
            
//             const access_token = JSON.parse(localStorage.getItem('access_token'))
//             var myHeaders = new Headers();
//             myHeaders.append("Authorization", `Bearer ${access_token}`);
            

//             var requestOptions = {
//                 method: 'DELETE',
//                 headers: myHeaders,
//                 redirect: 'follow'
//             };

//             const response = await fetch(`${BASE_URL}timetable/${id}/`, requestOptions)
            
//             if (!response.ok) {
//                 throw new Error('Server Error!');
//             }
    
//             let singleLearningDirection = getState().singleLearningDirection.singleLearningDirection
//             dispatch(fetchSingleLearningDirection(singleLearningDirection.id))
//         }
//         catch (error) {
//             return rejectWithValue(error.message);
//         }
//     }
// )

const setError = (state, action) => {
    state.status = 'rejected';
    state.error = action.payload;
}

const timetableSlice = createSlice({
    name: 'timetable',
    initialState: {
        timetable: null,
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
        [fetchTimetable.pending]: (state) => {
            state.status = 'loading';
            state.error = null;
        },
        [fetchTimetable.fulfilled]: (state, action) => {
            state.status = 'resolved';
            state.timetable = action.payload;
        },
        [fetchTimetable.rejected]: setError,

        [fetchAddTimetable.rejected]: setError,
        [fetchAddTimetable.fulfilled]: (state, action) => {
            state.status = 'resolved';
            state.timetable = action.payload;
        },
        // [fetchChangeTimetable.rejected]: setError,
        // [fetchDeleteTimetable.rejected]: setError,
    },
});

// const {addGroup, toggleComplete, removeGroup} = todoSlice.actions;

export default timetableSlice.reducer;