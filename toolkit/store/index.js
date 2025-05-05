import { configureStore } from "@reduxjs/toolkit";
import { counterReducer, loginReducer } from './reducers'
debugger
const store = configureStore({
  reducer: {
    counter: counterReducer,
    login: loginReducer,
  },
});

export default store;
