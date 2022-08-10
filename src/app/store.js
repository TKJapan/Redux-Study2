import { configureStore } from '@reduxjs/toolkit';
// loginReducerは、loginSliceにない、たぶん任意で名前をつけれる
import loginReducer from '../features/login/loginSlice';
import taskReducer from '../features/task/taskSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    task: taskReducer,
  },
});
