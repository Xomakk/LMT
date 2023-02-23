import { configureStore } from '@reduxjs/toolkit';
import groupReducer from './groupSlice';
import userReducer from './authSlice';
import singleGroupReducer from './singleGroupSlice';
import learningDirectionsReducer from './learningDirectionsSlise';
import SingleLearningDirectionReducer from './SingleLearningDirectionSlice';
import lessonsReducer from './lessonsSlice';
import timetableReducer from './timetableSlice'

export default configureStore({
  reducer: {
    groups: groupReducer,
    currentUser: userReducer,
    singleGroup: singleGroupReducer,
    learningDirections: learningDirectionsReducer,
    singleLearningDirection: SingleLearningDirectionReducer,
    lessons: lessonsReducer,
    timetable: timetableReducer,
  },
});
