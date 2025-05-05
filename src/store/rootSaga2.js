import { eventChannel, buffers } from "redux-saga";
import { all, take, put, call } from "redux-saga/effects";
import {
  WS_CONNECTED,
  WS_DISCONNECTED,
  WS_MESSAGE_RECEIVED,
  WS_ERROR
} from './reducers/websocket';

let wsChannel;
let wsClient;

// Create a WebSocket channel that will emit events when messages are received
const createWsChannel = () => {
  const channel = eventChannel((emit) => {
    const createWs = () => {
      console.log('Attempting to connect to WebSocket server at ws://localhost:8080');
      wsClient = new WebSocket("ws://localhost:8080");

      // 下面emit就等于在执行put，推动写了take的那个迭代器的继续执行(也就是watchWsRequest)
      wsClient.onopen = () => {
        console.log('WebSocket connection opened successfully');
        // Emit a connected event
        emit({ type: WS_CONNECTED });
      }

      wsClient.onmessage = (e) => {
        console.log('WebSocket message received:', e.data);
        try {
          // Parse the message data if it's a string
          const parsedData = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
          // Emit the message with its type and data
          emit({
            type: WS_MESSAGE_RECEIVED,
            data: parsedData
          });
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          emit({
            type: WS_MESSAGE_RECEIVED,
            data: e.data
          });
        }
      };

      wsClient.onclose = () => {
        console.log('WebSocket connection closed, attempting to reconnect...');
        emit({ type: WS_DISCONNECTED });
        // Try to reconnect after a short delay
        setTimeout(() => {
          createWs();
        }, 2000);
      }

      wsClient.onerror = (error) => {
        console.error('WebSocket error:', error);
        emit({
          type: WS_ERROR,
          data: error
        });
      }

      // Make the WebSocket client available globally for debugging
      window.wsClient = wsClient;
    }

    // Start the WebSocket connection
    createWs();

    // Return unsubscribe function
    return () => {
      console.log('Closing WebSocket connection');
      if (wsClient) {
        wsClient.close();
      }
    };
  }, buffers.expanding(32));

  return channel;
}

// Helper function to send a message through the WebSocket
function* sendMessage(message) {
  if (wsClient && wsClient.readyState === WebSocket.OPEN) {
    wsClient.send(typeof message === 'string' ? message : JSON.stringify(message));
    return true;
  }
  return false;
}

// Watch for WebSocket events and dispatch Redux actions
function* watchWsResponse() {
  console.log('Starting watchWsResponse saga');
  try {
    while (true) {
      console.log('Waiting for WebSocket messages...');
      const emitData = yield take(wsChannel);
      // 什么时候emitData会被赋值？？
      // 当在eventChannel那边emit之后，底层执行put，就会拿出takers数组的回调执行，执行的是本迭代器的next函数
      // 传入next的参数就是emit函数的参数：{ type: WS_CONNECTED }，因此emitData就是这个对象
      // 这么说的话，这个emit很像dispatch的替代版
      console.log('Received data from WebSocket channel:', emitData);

      // Handle different types of WebSocket events
      switch (emitData.type) {
        case WS_CONNECTED:
          // 这个时候就真正put，执行真正的dispatch函数，然后改变仓库里面的值
          yield put({ type: WS_CONNECTED });
          console.log('WebSocket connected, dispatched WS_CONNECTED action');
          break;

        case WS_DISCONNECTED:
          yield put({ type: WS_DISCONNECTED });
          console.log('WebSocket disconnected, dispatched WS_DISCONNECTED action');
          break;

        case WS_ERROR:
          yield put({
            type: WS_ERROR,
            payload: emitData.data
          });
          console.log('WebSocket error, dispatched WS_ERROR action');
          break;

        case WS_MESSAGE_RECEIVED:
          // If the message has a messageType, dispatch an action with that type
          const { messageType } = emitData.data || {};
          if (messageType) {
            console.log(`Dispatching action: ${messageType}`);
            yield put({
              type: messageType,
              payload: emitData.data
            });
          } else {
            // Otherwise dispatch a generic message received action
            yield put({
              type: WS_MESSAGE_RECEIVED,
              payload: emitData.data
            });
          }
          break;

        default:
          console.log('Unknown WebSocket event type:', emitData.type);
      }
    }
  } catch (error) {
    console.error('Error in watchWsResponse saga:', error);
    yield put({
      type: WS_ERROR,
      payload: error.message
    });
  }
}

// Root saga that sets up the WebSocket connection and watchers
export default function* rootSaga() {
  console.log('Starting rootSaga2 with WebSocket connection');

  try {
    debugger;
    // Create the WebSocket channel
    wsChannel = yield call(createWsChannel);

    // Start the watcher saga
    yield all([
      watchWsResponse()
    ]);

    console.log('rootSaga2 completed');
  } catch (error) {
    console.error('Error in rootSaga2:', error);
    yield put({
      type: WS_ERROR,
      payload: error.message
    });
  }
};

