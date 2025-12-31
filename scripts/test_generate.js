const axios = require('axios');
require('dotenv').config();

async function tryEndpoints(headers) {
  const base = (process.env.N8N_URL || '').replace(/\/$/, '');
  const endpoints = [`${base}/api/v1/workflows`, `${base}/workflows`, base];
  for (const url of endpoints) {
    try {
      const resp = await axios.get(url, { headers });
      return { url, data: resp.data };
    } catch (e) {
      // continue
>    }
  }
  throw new Error('no endpoints responded');
}

(async function main() {
  try {
    const headers = { 'X-N8N-API-KEY': process.env.N8N_API_KEY };
    const result = await tryEndpoints(headers);
    const raw = result.data;
    const items = raw?.data || raw || [];
    const limit = 5;
    const sliced = Array.isArray(items) ? items.slice(0, limit) : [];
    const out = sliced.map((w) => ({ id: w.id, name: w.name }));
    console.log('source:', result.url);
    console.log('count:', out.length);
    console.log(out);
  } catch (e) {
    console.error('error:', e.response?.data || e.message);
    process.exitCode = 1;
  }
})();
