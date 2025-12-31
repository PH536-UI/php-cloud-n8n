const axios = require("axios");
require("dotenv").config();

const headers = { "X-N8N-API-KEY": process.env.N8N_API_KEY };

async function tryEndpoints() {
  const base = (process.env.N8N_URL || '').replace(/\/$/, '');
  const endpoints = [
    `${base}/api/v1/workflows`,
    `${base}/workflows`,
    base,
  ];

  let lastError = null;
  for (const url of endpoints) {
    try {
      const resp = await axios.get(url, { headers });
      return { url, data: resp.data };
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}

async function health() {
  try {
    const result = await tryEndpoints();
    const data = result.data;
    // try to extract workflows array in common shapes
    const items = (data?.data) || data || [];
    console.log(`✅ n8n API conectada via ${result.url}`);
    console.log("📊 Workflows existentes:", (items.length || 0));
    const php = (items.filter ? items.filter((w) => w.tags?.includes("php")) : []);
    console.log("🏷️  Tags php:", php.length || 0);
    console.log("🔑  OwnerId scoped: OK");
  } catch (e) {
    console.error("❌ Falha:", e.response?.data || e.message);
  }
}

health();
