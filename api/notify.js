const https = require('https');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const body = `Opened at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`;

  await new Promise((resolve) => {
    const options = {
      hostname: 'ntfy.sh',
      port: 443,
      path: '/coffee_7',
      method: 'POST',
      headers: {
        'Title':          '\ud83c\udf3b She opened the book',
        'Priority':       'high',
        'Tags':           'sunflower,heart',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const r = https.request(options, (res) => { res.resume(); resolve(); });
    r.on('error', resolve);
    r.write(body);
    r.end();
  });

  res.status(200).json({ ok: true });
};
