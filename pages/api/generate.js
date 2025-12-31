const axios = require('axios');
require('dotenv').config();

module.exports = async function handler(req, res) {
  const headers = { 'X-N8N-API-KEY': process.env.N8N_API_KEY };
  const base = (process.env.N8N_URL || '').replace(/\/$/, '');
  const endpoints = [`${base}/api/v1/workflows`, `${base}/workflows`, base];

  // query params: fields= id,name  limit=100
  const fields = (req.query.fields || 'id,name').split(',').map((s) => s.trim()).filter(Boolean);
  const limit = parseInt(req.query.limit || '100', 10) || 100;

  let lastError = null;
  for (const url of endpoints) {
    try {
      const resp = await axios.get(url, { headers });
      const raw = resp.data;
      // normalize to array of workflows
      const items = raw?.data || raw || [];
      const sliced = Array.isArray(items) ? items.slice(0, limit) : [];
      const mapped = sliced.map((w) => {
        const out = {};
        for (const f of fields) out[f] = w[f];
        return out;
      });
      return res.status(200).json({ ok: true, source: url, count: mapped.length, workflows: mapped });
    } catch (e) {
      lastError = e;
    }
  }

  const message = lastError?.response?.data || lastError?.message || 'unknown error';
  return res.status(500).json({ ok: false, error: message });
};
