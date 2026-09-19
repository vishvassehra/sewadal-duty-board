// Reads the published Google Sheet on the server and hands the browser plain CSV.
// The sheet id never reaches the browser, so nobody can open the raw sheet from
// the page source. Change the sheet by setting SHEET_PUBLISH_ID (and SHEET_GID)
// in Vercel -> Settings -> Environment Variables; the values below are the default.

const PUBLISH_ID = process.env.SHEET_PUBLISH_ID ||
  '2PACX-1vTIUu2agX4IKd9Q9rrQAl0WjYu0-OQUZTZFLG4Usbs0tCbE1LVbqeAd1VvJY2GPQU3JcGjRaKNFTuup';
const GID = process.env.SHEET_GID || '2089480289';

export default async function handler(req, res) {
  const url = `https://docs.google.com/spreadsheets/d/e/${PUBLISH_ID}/pub?gid=${GID}&single=true&output=csv`;

  try {
    const upstream = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; duty-board/1.0)' }
    });

    if (!upstream.ok) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(502).json({ error: `Google returned ${upstream.status}.` });
    }

    const text = await upstream.text();

    // A published sheet returns CSV. HTML back means publishing was switched off.
    if (/^\s*</.test(text)) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(502).json({ error: 'The sheet is no longer published to the web.' });
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=120');
    return res.status(200).send(text);
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ error: 'Unable to reach the sheet.' });
  }
}
