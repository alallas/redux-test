const WebSocket = require('ws');

// Create a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server started on port 8080');

// Handle connection events
wss.on('connection', function connection(ws) {
  console.log('Client connected');

  // Send a welcome message
  const welcomeMessage = {
    messageType: 'WELCOME_MESSAGE',
    content: 'Welcome to the WebSocket server!'
  };
  ws.send(JSON.stringify(welcomeMessage));

  // Handle messages from clients
  ws.on('message', function incoming(message) {
    console.log('Received message:', message.toString());
    
    // Echo the message back
    const response = {
      messageType: 'ECHO_RESPONSE',
      content: message.toString()
    };
    ws.send(JSON.stringify(response));
  });

  // Send periodic messages
  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      const periodicMessage = {
        messageType: 'PERIODIC_UPDATE',
        timestamp: new Date().toISOString(),
        value: Math.random() * 100
      };
      ws.send(JSON.stringify(periodicMessage));
    }
  }, 5000);

  // Handle client disconnection
  ws.on('close', function close() {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});
