export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Sin query' });

  const instances = [
    'https://inv.nadeko.net',
    'https://invidious.privacyredirect.com',
    'https://y.com.sb',
    'https://invidious.nerdvpn.de'
  ];

  for (const base of instances) {
    try {
      const r = await fetch(`${base}/api/v1/search?q=${encodeURIComponent(q)}&type=video`, {
        signal: AbortSignal.timeout(5000)
      });
      if (r.ok) {
        const data = await r.json();
        return res.status(200).json(data);
      }
    } catch (e) {}
  }

  return res.status(500).json({ error: 'Todas las instancias fallaron' });
}
