export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Sin query' });

  const instances = [
    'https://pipedapi.kavin.rocks',
    'https://piped-api.garudalinux.org',
    'https://api.piped.projectsegfau.lt',
    'https://pipedapi.syncpundit.io',
    'https://pipedapi.moomoo.me'
  ];

  for (const base of instances) {
    try {
      const r = await fetch(`${base}/search?q=${encodeURIComponent(q)}&filter=videos`, {
        signal: AbortSignal.timeout(6000),
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (!r.ok) continue;
      const data = await r.json();
      const items = (data.items || [])
        .filter(v => v.type === 'stream')
        .slice(0, 10)
        .map(v => ({
          videoId: v.url?.replace('/watch?v=', '') || '',
          title: v.title,
          author: v.uploaderName,
          thumbnail: v.thumbnail
        }));
      if (items.length) return res.status(200).json(items);
    } catch (e) {}
  }

  return res.status(500).json({ error: 'Todas las instancias fallaron' });
}
