import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function WebSocketTest() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const dispatch = useDispatch();
  
  // You can add selectors here to get data from Redux store if needed
  // const someData = useSelector(state => state.someReducer.someData);

  useEffect(() => {
    // This effect will run once when the component mounts
    console.log('WebSocketTest component mounted');
    
    // Add a global event listener to capture WebSocket messages for debugging
    window.addEventListener('websocket-message', (event) => {
      console.log('WebSocket message event:', event.detail);
      setMessages(prev => [...prev, event.detail]);
    });
    
    return () => {
      // Cleanup when component unmounts
      window.removeEventListener('websocket-message', () => {});
    };
  }, []);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    
    if (window.wsClient && window.wsClient.readyState === WebSocket.OPEN) {
      window.wsClient.send(inputMessage);
      setInputMessage('');
    } else {
      console.error('WebSocket is not connected');
      setMessages(prev => [...prev, { error: 'WebSocket is not connected' }]);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>WebSocket Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message to send"
          style={{ padding: '8px', width: '70%' }}
        />
        <button 
          onClick={sendMessage}
          style={{ padding: '8px 16px', marginLeft: '10px' }}
        >
          Send
        </button>
      </div>
      
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'auto' }}>
        <h3>WebSocket Messages:</h3>
        {messages.length === 0 ? (
          <p>No messages yet. Waiting for WebSocket connection...</p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {messages.map((msg, index) => (
              <li key={index} style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#f5f5f5' }}>
                <pre>{JSON.stringify(msg, null, 2)}</pre>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default WebSocketTest;
