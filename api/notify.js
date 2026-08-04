const https = require('https');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const body = `She opened the book at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`;

  await new Promise((resolve) => {
    const options = {
      hostname: 'ntfy.sh',
      port: 443,
      path: '/coffee_7',
      method: 'POST',
      headers: {
        'Title':          'She opened the book',
        'Priority':       'high',
        'Tags':           'sunflower,heart',
        'Content-Type':   'text/plain',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const r = https.request(options, (response) => { response.resume(); resolve(); });
    r.on('error', resolve);
    r.write(body);
    r.end();
  });

  res.status(200).json({ ok: true });
};
