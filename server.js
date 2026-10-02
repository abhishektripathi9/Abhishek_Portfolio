const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const MESSAGES_FILE = path.join(PUBLIC_DIR, 'messages.json');

function getMessages() {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      return JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error reading messages:', e);
  }
  return [];
}

function saveMessages(msgs) {
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(msgs, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('Error saving messages:', e);
    return false;
  }
}

const server = http.createServer((req, res) => {
  // Health check endpoint for Render
  if (req.url === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
    return;
  }

  // API: Get all messages
  if (req.method === 'GET' && req.url === '/api/messages') {
    const msgs = getMessages();
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(msgs));
    return;
  }

  // API: Post new message
  if (req.method === 'POST' && req.url === '/api/messages') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (!data.name || !data.message) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Name and message required' }));
          return;
        }

        const msgs = getMessages();
        const newMsg = {
          id: 'msg-' + Date.now(),
          name: data.name.trim(),
          email: (data.email || '').trim(),
          subject: (data.subject || 'Portfolio Inquiry').trim(),
          message: data.message.trim(),
          createdAt: new Date().toISOString(),
          replies: []
        };
        msgs.unshift(newMsg);
        saveMessages(msgs);

        res.writeHead(201, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ success: true, message: newMsg }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API: Reply to a message (Abhishek verification via PIN 1808)
  if (req.method === 'POST' && req.url === '/api/messages/reply') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (data.pin !== '1808' && data.pin !== '180887') {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid PIN. Only Abhishek can post verified replies.' }));
          return;
        }

        if (!data.messageId || !data.text) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'MessageId and reply text required' }));
          return;
        }

        const msgs = getMessages();
        const target = msgs.find(m => m.id === data.messageId);
        if (!target) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Message not found' }));
          return;
        }

        if (!target.replies) target.replies = [];
        const reply = {
          id: 'rep-' + Date.now(),
          author: 'Abhishek Tripathi',
          isOwner: true,
          text: data.text.trim(),
          createdAt: new Date().toISOString()
        };
        target.replies.push(reply);
        saveMessages(msgs);

        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ success: true, reply, target }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Parse URL and strip query params
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === '/') {
    pathname = '/index.html';
  }

  const safePath = path.normalize(path.join(PUBLIC_DIR, pathname));

  // Security check: ensure path is within PUBLIC_DIR
  if (!safePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    let targetPath = safePath;

    if (!err && stats.isDirectory()) {
      const indexPath = path.join(safePath, 'index.html');
      if (fs.existsSync(indexPath)) {
        targetPath = indexPath;
      }
    }

    fs.stat(targetPath, (fileErr, fileStats) => {
      if (fileErr || !fileStats.isFile()) {
        // Fallback to root index.html for SPA routing
        const fallbackPath = path.join(PUBLIC_DIR, 'index.html');
        fs.readFile(fallbackPath, (readErr, content) => {
          if (readErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(content);
        });
        return;
      }

      const ext = path.extname(targetPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      // Set caching headers
      const cacheControl = ext === '.html' ? 'no-cache' : 'public, max-age=86400';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
        'X-Content-Type-Options': 'nosniff'
      });

      const stream = fs.createReadStream(targetPath);
      stream.pipe(res);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
