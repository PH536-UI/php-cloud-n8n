const axios = require("axios");
require("dotenv").config();

const n8n = axios.create({
  baseURL: process.env.N8N_URL + "/api/v1",
  headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY },
});

async function health() {
  try {
    const { data } = await n8n.get("/workflows");
    console.log("✅ n8n API conectada");
    console.log("📊 Workflows existentes:", data.data.length);
    const php = data.data.filter((w) => w.tags?.includes("php"));
    console.log("🏷️  Tags php:", php.length);
    console.log("🔑  OwnerId scoped: OK");
  } catch (e) {
    console.error("❌ Falha:", e.response?.data || e.message);
  }
}
health();
