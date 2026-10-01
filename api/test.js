export default async function handler(req, res) {
  try {
    const r = await fetch('https://pipedapi.kavin.rocks/search?q=test&filter=videos', {
      signal: AbortSignal.timeout(6000)
    });
    const text = await r.text();
    res.status(200).send(text.slice(0, 500));
  } catch(e) {
    res.status(500).send('Error: ' + e.message);
  }
}
