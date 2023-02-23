import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import BASE_URL from './const';
import { fetchSingleLearningDirection } from './SingleLearningDirectionSlice';

async function fetchLesson(id) {
    const access_token = JSON.parse(localStorage.getItem('access_token'))

    // получаем инфу о текущем юзере
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${access_token}`);

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    };

    const response = await fetch(`${BASE_URL}lessons/${id}/`, requestOptions)
    
    if (!response.ok) {
        throw new Error('Server Error!');
    }

    const data = await response.json();

    return data;
}

export const fetchLessons = createAsyncThunk(
    'lessons/fetchLessons',
    async function(idLessons, {rejectWithValue}) {
        try {
            let lessons = []


            if (!!idLessons) {
                let results

                for (let i = 0; i < idLessons.length; i++) {  
                    results = await fetchLesson(idLessons[i]);
                    lessons = [...lessons, results]
                }

            }

            return lessons || null;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAddlesson = createAsyncThunk(
    'lessons/addlesson',
    async function({topic, methodical}, {rejectWithValue, getState, dispatch}) {
        try {
            const access_token = JSON.parse(localStorage.getItem('access_token'))
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${access_token}`);

            let lessons = getState().lessons.lessons

            let num = lessons[lessons.length - 1].number + 1;
            var formdata = new FormData();
            formdata.append("number", num);
            formdata.append("topic", topic);
            formdata.append("methodical_material", methodical);

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
            };

            const response1 = await fetch(`${BASE_URL}lessons/`, requestOptions)
            
            if (!response1.ok) {
                throw new Error('Server Error!');
            }
    
            const data1 = await response1.json();


            let ids = []

            for (let i = 0; i < lessons.length; i++) {
                ids.push(lessons[i].id)
            }

            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "lessons": [
                        ...ids, data1.id
                    ]
            });

            var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            };

            let timetable = getState().timetable.timetable;
            let singleLearningDirection = getState().singleLearningDirection.singleLearningDirection;

            const response2 = await fetch(`${BASE_URL}timetable/${timetable.id}/`, requestOptions)

            if (!response2.ok) {
                throw new Error('Server Error!');
            }

            const data2 = await response2.json();

            dispatch(fetchSingleLearningDirection(singleLearningDirection.id))

            return data2.lessons;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchChangeLesson = createAsyncThunk(
    'lessons/addlesson',
    async function({id, number, topic, methodical_material}, {rejectWithValue, getState, dispatch}) {
        try {
            
            const access_token = JSON.parse(localStorage.getItem('access_token'))
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${access_token}`);
            
            var formdata = new FormData();
            formdata.append("number", number);
            formdata.append("topic", topic);
            formdata.append("methodical_material", methodical_material);

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
            };

            const response = await fetch(`${BASE_URL}lessons/${id}/`, requestOptions)
            
            if (!response.ok) {
                throw new Error('Server Error!');
            }

            let singleLearningDirection = getState().singleLearningDirection.singleLearningDirection
            dispatch(fetchSingleLearningDirection(singleLearningDirection.id))
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const fetchDeleteLesson = createAsyncThunk(
    'lessons/addlesson',
    async function(id, {rejectWithValue, getState, dispatch}) {
        try {
            
            const access_token = JSON.parse(localStorage.getItem('access_token'))
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${access_token}`);
            

            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                redirect: 'follow'
            };

            const response = await fetch(`${BASE_URL}lessons/${id}/`, requestOptions)
            
            if (!response.ok) {
                throw new Error('Server Error!');
            }
    
            let singleLearningDirection = getState().singleLearningDirection.singleLearningDirection
            dispatch(fetchSingleLearningDirection(singleLearningDirection.id))
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

const setError = (state, action) => {
    state.status = 'rejected';
    state.error = action.payload;
}

const lessonsSlice = createSlice({
    name: 'lessons',
    initialState: {
        lessons: null,
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
        [fetchLessons.pending]: (state) => {
            state.status = 'loading';
            state.error = null;
        },
        [fetchLessons.fulfilled]: (state, action) => {
            state.status = 'resolved';
            state.lessons = action.payload;
        },
        [fetchLessons.rejected]: setError,

        [fetchAddlesson.rejected]: setError,
        [fetchAddlesson.fulfilled]: (state, action) => {
            state.status = 'resolved';
            state.lessons = action.payload;
        },
        [fetchChangeLesson.rejected]: setError,
        [fetchDeleteLesson.rejected]: setError,
    },
});

// const {addGroup, toggleComplete, removeGroup} = todoSlice.actions;

export default lessonsSlice.reducer;