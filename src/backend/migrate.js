const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Retrieve connection string from env or build it using known Supabase credentials from .AP-key.md
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:KynzTJwlTObLYqzh@db.qcstxdbrtkzzipjrvwmy.supabase.co:5432/postgres';

async function run() {
  console.log('Connecting to PostgreSQL database...');
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Successfully connected to database.');

    // 1. Run 001_initial_schema.sql
    const schemaPath = path.join(__dirname, 'migrations', '001_initial_schema.sql');
    console.log(`Reading schema from ${schemaPath}...`);
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Applying schema migrations...');
    await client.query(schemaSql);
    console.log('Schema migrations applied successfully.');

    // 2. Run seeds.sql
    const seedsPath = path.join(__dirname, 'migrations', 'seeds.sql');
    console.log(`Reading seeds from ${seedsPath}...`);
    const seedsSql = fs.readFileSync(seedsPath, 'utf8');

    console.log('Applying seeds...');
    await client.query(seedsSql);
    console.log('Seeds applied successfully.');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}

run();
