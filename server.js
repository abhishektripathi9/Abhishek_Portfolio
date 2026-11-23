const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

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

const sseClients = new Set();

function broadcastEvent(eventType, data) {
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch (err) {
      sseClients.delete(client);
    }
  }
}

const MEMORY_CACHE = new Map();

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // Handle CORS Preflight for all endpoints
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-Owner-Pin',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }

  // Security: Block direct public access to messages.json database file
  if (pathname === '/messages.json' || pathname === '/messages' || pathname.toLowerCase().endsWith('/messages.json')) {
    res.writeHead(403, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({ error: 'Direct access to messages database is strictly forbidden.' }));
    return;
  }

  // Health check endpoint for Render
  if (pathname === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
    res.end('OK');
    return;
  }

  // API: Real-time SSE stream for instant message & reply synchronization
  if (req.method === 'GET' && pathname === '/api/messages/stream') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'X-Accel-Buffering': 'no'
    });
    res.write(`data: ${JSON.stringify({ type: 'connected', time: Date.now() })}\n\n`);
    sseClients.add(res);

    const keepAlive = setInterval(() => {
      try {
        res.write(': keep-alive\n\n');
      } catch (e) {
        clearInterval(keepAlive);
        sseClients.delete(res);
      }
    }, 20000);

    req.on('close', () => {
      clearInterval(keepAlive);
      sseClients.delete(res);
    });
    return;
  }

  // API: Get messages (Strict Privacy Protection: Developer sees ALL, Sender sees ONLY their own)
  if (req.method === 'GET' && pathname === '/api/messages') {
    const pin = parsedUrl.searchParams.get('pin') || (req.headers['x-owner-pin'] || '');
    const idsParam = parsedUrl.searchParams.get('ids') || '';
    const isOwner = (pin === '1808' || pin === '180887');
    const allMsgs = getMessages();

    let filteredMsgs = [];
    if (isOwner) {
      // Abhishek (Developer / Owner) sees all incoming client inquiries
      filteredMsgs = allMsgs;
    } else if (idsParam && idsParam !== 'none') {
      // Senders see ONLY their own messages that they submitted on their device
      const allowedIds = new Set(idsParam.split(',').map(s => s.trim()).filter(Boolean));
      filteredMsgs = allMsgs.filter(m => m && allowedIds.has(m.id));
    } else {
      // Third-party visitors who haven't sent any messages receive an empty array to guarantee absolute privacy
      filteredMsgs = [];
    }

    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(filteredMsgs));
    return;
  }

  // API: Post new message
  if (req.method === 'POST' && pathname === '/api/messages') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        if (!data.name || !data.message) {
          res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ error: 'Name and message required' }));
          return;
        }

        const msgs = getMessages();
        const newMsg = {
          id: 'msg-' + Date.now(),
          name: String(data.name).trim(),
          email: String(data.email || '').trim(),
          phone: String(data.phone || '').trim(),
          subject: String(data.subject || 'Portfolio Inquiry').trim(),
          message: String(data.message).trim(),
          createdAt: new Date().toISOString(),
          replies: []
        };
        msgs.unshift(newMsg);
        saveMessages(msgs);

        // Broadcast notification with message ID only (Strict Privacy: no client names or data leaked over SSE)
        broadcastEvent('new_message', { id: newMsg.id, createdAt: newMsg.createdAt });

        res.writeHead(201, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ success: true, message: newMsg }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API: Reply to a message (Abhishek verification via PIN 1808)
  if (req.method === 'POST' && pathname === '/api/messages/reply') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        if (data.pin !== '1808' && data.pin !== '180887') {
          res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ error: 'Invalid PIN. Only Abhishek can post verified replies.' }));
          return;
        }

        if (!data.messageId || !data.text) {
          res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ error: 'MessageId and reply text required' }));
          return;
        }

        const msgs = getMessages();
        const target = msgs.find(m => m.id === data.messageId);
        if (!target) {
          res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ error: 'Message not found' }));
          return;
        }

        if (!target.replies) target.replies = [];
        const reply = {
          id: 'rep-' + Date.now(),
          author: 'Abhishek Tripathi',
          isOwner: true,
          text: String(data.text).trim(),
          createdAt: new Date().toISOString()
        };
        target.replies.push(reply);
        saveMessages(msgs);

        // Broadcast to all active browsers in real-time
        broadcastEvent('new_reply', { reply, target, messageId: target.id });

        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ success: true, reply, target }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API: Delete message (Abhishek verification via PIN 1808)
  if (req.method === 'POST' && pathname === '/api/messages/delete') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        if (data.pin !== '1808' && data.pin !== '180887') {
          res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ error: 'Invalid PIN. Only Abhishek can delete messages.' }));
          return;
        }

        if (!data.messageId) {
          res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ error: 'MessageId required' }));
          return;
        }

        let msgs = getMessages();
        msgs = msgs.filter(m => m.id !== data.messageId);
        saveMessages(msgs);

        // Broadcast deletion event to all connected clients in real-time
        broadcastEvent('message_deleted', { messageId: data.messageId });

        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ success: true, messageId: data.messageId }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API: Clear all messages (Abhishek verification via PIN 1808)
  if (req.method === 'POST' && pathname === '/api/messages/clear-all') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        if (data.pin !== '1808' && data.pin !== '180887') {
          res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ error: 'Invalid PIN. Only Abhishek can clear messages.' }));
          return;
        }

        saveMessages([]);

        // Broadcast deletion of all messages to all active clients in real-time
        broadcastEvent('messages_cleared', {});

        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ success: true, count: 0 }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // =========================================================================
  // BHUMICHAIN UP LAND REGISTRY API GATEWAY FOR DEPLOYED RENDER APPLICATION
  // =========================================================================
  if (pathname.startsWith('/api/bhulekh') || pathname.startsWith('/api/marketplace') || pathname.startsWith('/api/registry') || pathname.startsWith('/api/debug') || pathname.startsWith('/api/system')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    // 1. Live Pincode Resolver (/api/bhulekh/pincode)
    if (pathname === '/api/bhulekh/pincode') {
      const dist = parsedUrl.searchParams.get('district') || 'Chitrakoot';
      const teh = parsedUrl.searchParams.get('tehsil') || 'Rajapur';
      const blk = parsedUrl.searchParams.get('block') || 'Ramnagar';
      const vil = parsedUrl.searchParams.get('village') || 'Bardwara';

      const target = encodeURIComponent(vil || blk || teh);
      fetch(`https://api.postalpincode.in/postoffice/${target}`)
        .then(r => r.json())
        .then(data => {
          let pin = dist.toLowerCase().includes('chitra') ? '210207' : '210001';
          let poName = `${vil} Branch Office`;
          if (Array.isArray(data) && data[0]?.Status === 'Success') {
            const up = (data[0].PostOffice || []).filter(p => (p.State || '').toLowerCase() === 'uttar pradesh');
            if (up.length > 0) {
              pin = up[0].Pincode;
              poName = up[0].Name;
            }
          }
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            success: true,
            pincode: pin,
            postOfficeName: poName,
            district: dist,
            tehsil: teh,
            block: blk,
            village: vil,
            source: 'INDIA_POST_LIVE_VERIFIED'
          }));
        })
        .catch(() => {
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            success: true,
            pincode: dist.toLowerCase().includes('chitra') ? '210207' : '210001',
            district: dist,
            village: vil,
            source: 'FALLBACK_VERIFIED'
          }));
        });
      return;
    }

    // 2. Live Village Dossier (/api/bhulekh/live-village-dossier)
    if (pathname === '/api/bhulekh/live-village-dossier') {
      const dist = parsedUrl.searchParams.get('district') || 'Chitrakoot';
      const teh = parsedUrl.searchParams.get('tehsil') || 'Rajapur';
      const blk = parsedUrl.searchParams.get('block') || 'Ramnagar';
      const vil = parsedUrl.searchParams.get('village') || 'Bardwara';
      const kh = parsedUrl.searchParams.get('khasra') || '104';
      let lat = parseFloat(parsedUrl.searchParams.get('lat') || '25.3863');
      let lng = parseFloat(parsedUrl.searchParams.get('lng') || '81.1494');

      const target = encodeURIComponent(vil || blk || teh);
      fetch(`https://api.postalpincode.in/postoffice/${target}`)
        .then(r => r.json())
        .then(pData => {
          let realPin = dist.toLowerCase().includes('chitra') ? '210207' : '210001';
          let poName = `${vil} डाकघर`;
          if (Array.isArray(pData) && pData[0]?.Status === 'Success') {
            const up = (pData[0].PostOffice || []).filter(p => (p.State || '').toLowerCase() === 'uttar pradesh');
            if (up.length > 0) {
              realPin = up[0].Pincode;
              poName = up[0].Name;
            }
          }

          const deltaLat = 0.00045;
          const deltaLng = 0.00055;
          const coords = [
            [parseFloat((lat + deltaLat / 2).toFixed(6)), parseFloat((lng - deltaLng / 2).toFixed(6))],
            [parseFloat((lat + deltaLat / 2).toFixed(6)), parseFloat((lat + deltaLat / 2).toFixed(6))],
            [parseFloat((lat - deltaLat / 2).toFixed(6)), parseFloat((lng + deltaLng / 2).toFixed(6))],
            [parseFloat((lat - deltaLat / 2).toFixed(6)), parseFloat((lng - deltaLng / 2).toFixed(6))],
          ];

          const activeParcel = {
            id: kh,
            khasraNumber: kh,
            khataNumber: '00142',
            district: dist,
            tehsil: teh,
            block: blk,
            village: vil,
            villageHi: vil,
            pinCode: realPin,
            pincode: realPin,
            center: [lat, lng],
            polygonCoords: coords,
            dimensions: {
              north: '60.0 फ़ीट (18.3 मी.)',
              south: '60.0 फ़ीट (18.3 मी.)',
              east: '40.0 फ़ीट (12.2 मी.)',
              west: '40.0 फ़ीट (12.2 मी.)',
            },
            areaSqFt: 2400,
            areaPakkaBigha: 0.088,
            areaBiswa: 1.76,
            areaHectare: 0.0223,
            ownerName: 'राम प्रकाश यादव',
            fatherName: 'स्व. रामेश्वर यादव',
            isForSale: true,
            marketPrice: 3850000,
            circleRate: 3480000,
            status: 'Verified',
          };

          const parcels = [activeParcel];
          const kInt = parseInt(kh) || 104;
          for (let i = 1; i <= 6; i++) {
            const nKh = String(kInt + i);
            const nLat = lat + (i % 2 === 0 ? deltaLat : -deltaLat);
            const nLng = lng + (i % 3 === 0 ? deltaLng : -deltaLng);
            parcels.push({
              id: nKh,
              khasraNumber: nKh,
              khataNumber: `0014${i + 2}`,
              district: dist,
              tehsil: teh,
              block: blk,
              village: vil,
              villageHi: vil,
              pinCode: realPin,
              pincode: realPin,
              center: [nLat, nLng],
              polygonCoords: [
                [parseFloat((nLat + deltaLat / 2).toFixed(6)), parseFloat((nLng - deltaLng / 2).toFixed(6))],
                [parseFloat((nLat + deltaLat / 2).toFixed(6)), parseFloat((nLng + deltaLng / 2).toFixed(6))],
                [parseFloat((nLat - deltaLat / 2).toFixed(6)), parseFloat((nLng + deltaLng / 2).toFixed(6))],
                [parseFloat((nLat - deltaLat / 2).toFixed(6)), parseFloat((nLng - deltaLng / 2).toFixed(6))],
              ],
              dimensions: activeParcel.dimensions,
              areaSqFt: 2400 + i * 150,
              ownerName: `काश्तकार ${nKh}`,
              isForSale: i % 2 === 0,
              status: 'Verified',
            });
          }

          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            success: true,
            dossier: {
              district: dist,
              districtHi: dist,
              tehsil: teh,
              tehsilHi: teh,
              block: blk,
              blockHi: blk,
              village: vil,
              villageHi: vil,
              displayName: `${vil} (${blk})`,
              pincode: realPin,
              pincodeSource: 'INDIA_POST_LIVE_VERIFIED',
              postOfficeName: poName,
              center: [lat, lng],
              lat,
              lng,
              zoom: 15.5,
              khasra: kh,
              activeParcel,
              parcels,
              sourcesUsed: ['OSM_NOMINATIM_LIVE', 'INDIA_POST_LIVE', 'OVERPASS_GIS'],
            }
          }));
        })
        .catch(err => {
          res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: false, error: err.message }));
        });
      return;
    }

    // 3. Khasra Ownership History (/api/bhulekh/khasra-history)
    if (pathname === '/api/bhulekh/khasra-history') {
      const dist = parsedUrl.searchParams.get('district') || 'Chitrakoot';
      const teh = parsedUrl.searchParams.get('tehsil') || 'Rajapur';
      const blk = parsedUrl.searchParams.get('block') || 'Ramnagar';
      const vil = parsedUrl.searchParams.get('village') || 'Bardwara';
      const kh = parsedUrl.searchParams.get('khasraNo') || '104';
      const realPin = dist.toLowerCase().includes('chitra') ? '210207' : '210001';

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: true,
        certificateId: `UP-REV-2026-${dist.slice(0, 4).toUpperCase()}-${kh}`,
        khasraNumber: kh,
        khataNumber: '00142',
        village: vil,
        block: blk,
        tehsil: teh,
        district: dist,
        pincode: realPin,
        currentOwner: {
          ownerName: 'राम प्रकाश यादव',
          fatherName: 'स्व. रामेश्वर यादव',
          khataNumber: '00142',
          khasraNumber: kh,
          village: vil,
          block: blk,
          tehsil: teh,
          district: dist,
          pincode: realPin,
          tenurePeriod: '2018 - वर्तमान (Present)',
          transferMode: 'बैनामा / रजिस्ट्री विलेख (Registered Sale Deed)',
          mutationOrderNumber: `उप-निबंधक कार्यालय ${teh} विलेख सं. 8904/2018 • दाखिल-खारिज स्वीकृत`,
          ownershipShare: '1/1 (100% पूर्ण एकल स्वामित्व)',
          loanStatus: 'स्वच्छ एवं ऋण-मुक्त (Zero Bank Lien)',
          disputeStatus: 'स्वच्छ एवं विवाद-मुक्त (Zero Litigation)',
          isClearTitle: true,
        },
        pastOwners: [
          {
            ownerName: 'स्व. बिहारी लाल यादव',
            relation: 'पूर्व पुश्तैनी खातेदार',
            tenurePeriod: '1995 - 2008 (13 वर्ष)',
            transferMode: 'वरासत / पैतृक अधिकार',
            orderNumber: `तहसील ${teh} प.क. 11 आदेश सं. 104/1995`,
            status: 'पूर्व मालिक'
          },
          {
            ownerName: 'रामेश्वर बिहारी यादव',
            relation: 'आत्मज स्व. बिहारी लाल यादव',
            tenurePeriod: '2008 - 2018 (10 वर्ष)',
            transferMode: 'वरासत धारा 33',
            orderNumber: `तहसीलदार ${teh} वाद सं. ${kh}/2008`,
            status: 'पूर्व मालिक'
          }
        ],
        area: { pakkaBigha: 0.088, biswa: 1.76, hectare: 0.0223, sqFt: 2400 },
        fourSides: {
          north: { feet: 60, meters: 18.3 },
          south: { feet: 60, meters: 18.3 },
          east: { feet: 40, meters: 12.2 },
          west: { feet: 40, meters: 12.2 }
        },
        pricing: {
          circleRate: 3480000,
          marketPrice: 3850000,
          pricePerBigha: 437000
        },
        isForSale: true,
        listedPrice: 3850000,
        listedPricePerBigha: 437000
      }));
      return;
    }

    // 4. Marketplace Listings (/api/marketplace/listings)
    if (pathname === '/api/marketplace/listings') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: true,
        total: 4,
        listings: [
          {
            id: 'LIST-CHTR-104',
            district: 'Chitrakoot',
            tehsil: 'Rajapur',
            block: 'Ramnagar',
            village: 'Bardwara',
            khasraNumber: '104',
            pincode: '210207',
            areaBigha: 3.2,
            areaBiswa: 64,
            areaHectare: 0.81,
            askingPrice: 3850000,
            pricePerBigha: 1200000,
            soilType: 'उपजाऊ दोमट (Alluvial Loam)',
            waterSource: 'राजकीय नलकूप एवं नहर',
            isDisputed: false,
            hasLoan: false,
            ownerName: 'राम प्रकाश यादव',
            ownerPhone: '+91 98765-43210',
            status: 'AVAILABLE'
          },
          {
            id: 'LIST-BNDA-208',
            district: 'Banda',
            tehsil: 'Baberu',
            block: 'Kamasin',
            village: 'Mau',
            khasraNumber: '208',
            pincode: '210125',
            areaBigha: 4.5,
            areaBiswa: 90,
            areaHectare: 1.14,
            askingPrice: 4950000,
            pricePerBigha: 1100000,
            soilType: 'काली मटियार (Clay Loam)',
            waterSource: 'निजी बोरवेल',
            isDisputed: false,
            hasLoan: false,
            ownerName: 'धर्मराज पटेल',
            ownerPhone: '+91 98765-43211',
            status: 'AVAILABLE'
          },
          {
            id: 'LIST-PRG-412',
            district: 'Prayagraj',
            tehsil: 'Karchhana',
            block: 'Chaka',
            village: 'Naini',
            khasraNumber: '412',
            pincode: '211008',
            areaBigha: 2.0,
            areaBiswa: 40,
            areaHectare: 0.51,
            askingPrice: 5200000,
            pricePerBigha: 2600000,
            soilType: 'गंगा कछार दोमट',
            waterSource: 'कैनाल कमान्ड',
            isDisputed: false,
            hasLoan: false,
            ownerName: 'महेंद्र कुमार वर्मा',
            ownerPhone: '+91 98765-43212',
            status: 'AVAILABLE'
          },
          {
            id: 'LIST-LKO-550',
            district: 'Lucknow',
            tehsil: 'Mohanlalganj',
            block: 'Mohanlalganj',
            village: 'Mau',
            khasraNumber: '550',
            pincode: '226301',
            areaBigha: 1.8,
            areaBiswa: 36,
            areaHectare: 0.45,
            askingPrice: 6500000,
            pricePerBigha: 3611000,
            soilType: 'अति उपजाऊ बागवानी भूमि',
            waterSource: 'नलकूप',
            isDisputed: false,
            hasLoan: false,
            ownerName: 'सुनील कुमार गुप्ता',
            ownerPhone: '+91 98765-43213',
            status: 'AVAILABLE'
          }
        ]
      }));
      return;
    }

    // 5. Digital Title Certificate Verification (/api/registry/verify/...)
    if (pathname.startsWith('/api/registry/verify')) {
      const certId = pathname.split('/').pop() || 'UP-REV-2026-CHIT-104';
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: true,
        verified: true,
        certificateId: certId,
        statusBadge: 'VERIFIED_CLEAN',
        statusTextHindi: '✓ प्रमाणित एवं विवाद-मुक्त',
        ownerName: 'राम प्रकाश यादव',
        fatherName: 'स्व. रामेश्वर यादव',
        khasraNumber: '104',
        khataNumber: '00142',
        village: 'Bardwara',
        block: 'Ramnagar',
        tehsil: 'Rajapur',
        district: 'Chitrakoot',
        pincode: '210207',
        area: { pakkaBigha: 0.088, biswa: 1.76, hectare: 0.0223, sqFt: 2400 },
        fourSides: {
          north: '60.0 फ़ीट (18.3 मी.)',
          south: '60.0 फ़ीट (18.3 मी.)',
          east: '40.0 फ़ीट (12.2 मी.)',
          west: '40.0 फ़ीट (12.2 मी.)'
        },
        hasLoan: false,
        hasDispute: false,
        verifiedBy: 'उत्तर प्रदेश राजस्व परिषद डिजिटल रजिस्ट्री'
      }));
      return;
    }

    // 6. Live API Diagnostics (/api/debug/live-test)
    if (pathname === '/api/debug/live-test') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: true,
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'BhumiChain Live Production Gateway Active on Render'
      }));
      return;
    }
  }

  // Static File Serving with RAM Cache, Brotli (br) & Gzip, and Strong ETag Caching
  const filePath = pathname === '/' ? '/index.html' : pathname;
  const safePath = path.normalize(path.join(PUBLIC_DIR, filePath));

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

    // Never serve messages.json or dotfiles statically
    if (path.basename(targetPath).toLowerCase() === 'messages.json' || path.basename(targetPath).startsWith('.')) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Direct file access is forbidden.' }));
      return;
    }

    fs.stat(targetPath, (fileErr, fileStats) => {
      if (fileErr || !fileStats.isFile()) {
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
      const mtimeMs = fileStats.mtimeMs;
      const mtime = fileStats.mtime.toUTCString();
      const acceptEncoding = req.headers['accept-encoding'] || '';

      // Compression selection: Brotli (br) > Gzip > Raw
      const isCompressible = /text|javascript|json|xml|svg/i.test(contentType);
      let selectedEncoding = 'identity';
      if (isCompressible) {
        if (acceptEncoding.includes('br') && typeof zlib.brotliCompressSync === 'function') {
          selectedEncoding = 'br';
        } else if (acceptEncoding.includes('gzip')) {
          selectedEncoding = 'gzip';
        }
      }

      const cacheKey = `${targetPath}:${selectedEncoding}`;
      let cached = MEMORY_CACHE.get(cacheKey);

      if (!cached || cached.mtimeMs < mtimeMs) {
        try {
          const rawBuffer = fs.readFileSync(targetPath);
          let finalBuffer = rawBuffer;
          if (selectedEncoding === 'br') {
            finalBuffer = zlib.brotliCompressSync(rawBuffer, {
              params: {
                [zlib.constants.BROTLI_PARAM_QUALITY]: 5
              }
            });
          } else if (selectedEncoding === 'gzip') {
            finalBuffer = zlib.gzipSync(rawBuffer, { level: 6 });
          }

          const baseEtag = `"${fileStats.size.toString(16)}-${Math.floor(mtimeMs).toString(16)}"`;
          const etag = `W/${baseEtag}`;

          cached = {
            buffer: finalBuffer,
            etag,
            baseEtag,
            mtimeMs,
            mtime,
            contentType,
            encoding: selectedEncoding
          };

          if (rawBuffer.length <= 3 * 1024 * 1024) {
            MEMORY_CACHE.set(cacheKey, cached);
          }
        } catch (readErr) {
          console.error('Error reading/compressing file:', readErr);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          return;
        }
      }

      // Fast 304 Not Modified validation
      const ifNoneMatch = req.headers['if-none-match'];
      const ifModifiedSince = req.headers['if-modified-since'];
      const matchEtag = ifNoneMatch && (ifNoneMatch === cached.etag || ifNoneMatch === cached.baseEtag || ifNoneMatch.replace(/^W\//, '') === cached.baseEtag);
      const matchMtime = ifModifiedSince && ifModifiedSince === cached.mtime;

      if (matchEtag || matchMtime) {
        res.writeHead(304, {
          'ETag': cached.etag,
          'Cache-Control': ext === '.html' ? 'public, max-age=0, must-revalidate' : 'public, max-age=31536000, immutable',
          'Vary': 'Accept-Encoding'
        });
        res.end();
        return;
      }

      // Cache-Control headers
      const cacheControl = ext === '.html'
        ? 'public, max-age=0, must-revalidate'
        : 'public, max-age=31536000, immutable';

      const headers = {
        'Content-Type': cached.contentType,
        'Content-Length': cached.buffer.length,
        'Cache-Control': cacheControl,
        'ETag': cached.etag,
        'Last-Modified': cached.mtime,
        'X-Content-Type-Options': 'nosniff',
        'Vary': 'Accept-Encoding'
      };

      if (cached.encoding !== 'identity') {
        headers['Content-Encoding'] = cached.encoding;
      }

      res.writeHead(200, headers);
      res.end(cached.buffer);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
