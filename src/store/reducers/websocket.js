// Initial state
const initialState = {
  connected: false,
  messages: [],
  lastMessage: null,
  error: null
};

// Action types
export const WS_CONNECTED = 'WS_CONNECTED';
export const WS_DISCONNECTED = 'WS_DISCONNECTED';
export const WS_MESSAGE_RECEIVED = 'WS_MESSAGE_RECEIVED';
export const WS_ERROR = 'WS_ERROR';
export const WELCOME_MESSAGE = 'WELCOME_MESSAGE';
export const ECHO_RESPONSE = 'ECHO_RESPONSE';
export const PERIODIC_UPDATE = 'PERIODIC_UPDATE';

// Reducer
const websocketReducer = (state = initialState, action) => {
  switch (action.type) {
    case WS_CONNECTED:
      return {
        ...state,
        connected: true,
        error: null
      };
    
    case WS_DISCONNECTED:
      return {
        ...state,
        connected: false
      };
    
    case WS_MESSAGE_RECEIVED:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        lastMessage: action.payload
      };
    
    case WS_ERROR:
      return {
        ...state,
        error: action.payload
      };
    
    case WELCOME_MESSAGE:
    case ECHO_RESPONSE:
    case PERIODIC_UPDATE:
      // Create a custom event to notify components about the message
      const event = new CustomEvent('websocket-message', { 
        detail: action.payload 
      });
      window.dispatchEvent(event);
      
      return {
        ...state,
        messages: [...state.messages, action.payload],
        lastMessage: action.payload
      };
    
    default:
      return state;
  }
};

export default websocketReducer;
