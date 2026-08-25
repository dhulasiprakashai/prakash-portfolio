const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value.trim();
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Supabase URL or Key not found in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

const tables = [
  'profile',
  'about',
  'projects',
  'skills',
  'experience',
  'education',
  'services',
  'stats',
  'site_settings'
];

async function check() {
  console.log("Checking Supabase connection and tables...");
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*');
      if (error) {
        console.error(`Error querying table "${table}":`, error.message);
      } else {
        console.log(`Table "${table}": ${data.length} rows`);
        if (table === 'projects') {
          console.log(`Projects:`, JSON.stringify(data, null, 2));
        } else if (data.length > 0) {
          console.log(`  Sample row:`, JSON.stringify(data[0], null, 2));
        }
      }
    } catch (err) {
      console.error(`Exception querying table "${table}":`, err.message);
    }
  }
}

check();
