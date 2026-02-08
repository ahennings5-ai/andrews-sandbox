const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT id, name, layer, "businessCase", "executionPlan", status 
      FROM "BusinessIdea" 
      WHERE status != 'archived' 
      ORDER BY layer DESC, "createdAt" DESC
    `);
    console.log(JSON.stringify(result.rows, null, 2));
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
