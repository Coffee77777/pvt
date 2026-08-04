import https from 'https';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const body = `Opened at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`;

  await new Promise((resolve) => {
    const options = {
      hostname: 'ntfy.sh',
      port: 443,
      path: '/coffee_7',
      method: 'POST',
      headers: {
        'Title':    '🌻 She opened the book',
        'Priority': 'high',
        'Tags':     'sunflower,heart',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const reqN = https.request(options, (r) => { r.resume(); resolve(); });
    reqN.on('error', resolve);
    reqN.write(body);
    reqN.end();
  });

  res.status(200).json({ ok: true });
}
