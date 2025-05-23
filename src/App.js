import Counter from "./components/Counter";
import WebSocketTest from "./components/WebSocketTest";
import { Provider } from "react-redux";
import store from "./store/index";
import React from "react";

function App() {
  return (
    <Provider store={store}>
      <div style={{ padding: '20px' }}>
        <h1>Redux Saga WebSocket Test</h1>
        <Counter />
        <hr />
        <WebSocketTest />
      </div>
    </Provider>
  );
}

export default App;
