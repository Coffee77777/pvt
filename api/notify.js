export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    await fetch('https://ntfy.sh/coffee_7', {
      method: 'POST',
      headers: {
        'Title': '🌻 She opened the book',
        'Priority': 'high',
        'Tags': 'sunflower,heart'
      },
      body: `Opened at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`
    });
  } catch(e) {}
  res.status(200).json({ ok: true });
}
