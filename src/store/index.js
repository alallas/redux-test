import { applyMiddleware, combineReducers, createStore, compose } from "redux";
import { counterReducer, loginReducer, websocketReducer } from "./reducers";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./rootSaga2";

const AllReducers = combineReducers({
  counter: counterReducer,
  login: loginReducer,
  websocket: websocketReducer,
});

// Create Redux DevTools enhancer for better debugging
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  AllReducers,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

// Run the saga middleware with our root saga
console.log('Running rootSaga2 with saga middleware');
sagaMiddleware.run(rootSaga);

export default store;
