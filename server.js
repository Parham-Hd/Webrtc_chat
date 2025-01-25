const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');

// بارگذاری گواهینامه‌ها و کلید SSL
const serverOptions = {
  key: fs.readFileSync('C:\\Users\\Asus\\Downloads\\Compressed\\httpd-2.4.63-250122-win64-VS17\\Apache24\\conf\\private.key'),
  cert: fs.readFileSync('C:\\Users\\Asus\\Downloads\\Compressed\\httpd-2.4.63-250122-win64-VS17\\Apache24\\conf\\certificate.crt'),
  host: '0.0.0.0',
};

// ایجاد سرور HTTPS
const server = https.createServer(serverOptions);

// ایجاد WebSocket Server روی پورت 3000
const wss = new WebSocket.Server({ server });

console.log(`[${new Date().toISOString()}] WebSocket server is starting...`);

// مدیریت اتصال کلاینت‌ها
wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  console.log(`[${new Date().toISOString()}] A new client connected from IP: ${clientIp}`);

  // ارسال پیام خوش‌آمدگویی به کلاینت
  //ws.send(JSON.stringify({ message: "Welcome to the WebSocket server!" }));
  console.log(`[${new Date().toISOString()}] Welcome message sent to ${clientIp}`);

  // مدیریت پیام‌های دریافتی از کلاینت‌ها
  ws.on('message', (message) => {
    console.log(`[${new Date().toISOString()}] Message received from ${clientIp}: ${message}`);
    try {
      const parsedMessage = JSON.parse(message);
      console.log(`[${new Date().toISOString()}] Parsed message:`, parsedMessage);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error parsing message from ${clientIp}: ${error.message}`);
    }

    // ارسال پیام به تمامی کلاینت‌ها به جز فرستنده
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        console.log(`[${new Date().toISOString()}] Forwarding message from ${clientIp} to another client: ${message}`);
        client.send(message);
      }
    });
  });

  // مدیریت خطاهای WebSocket
  ws.on('error', (error) => {
    console.error(`[${new Date().toISOString()}] Error from client ${clientIp}: ${error.message}`);
  });

  // مدیریت قطع اتصال کلاینت
  ws.on('close', (code, reason) => {
    console.log(`[${new Date().toISOString()}] Client from ${clientIp} disconnected. Code: ${code}, Reason: ${reason}`);
  });
});

// راه‌اندازی سرور بر روی پورت 3000
server.listen(3000, '0.0.0.0', () => {
  console.log(`[${new Date().toISOString()}] WebSocket server is running on wss://<YOUR_SERVER_IP>:3000`);
});
