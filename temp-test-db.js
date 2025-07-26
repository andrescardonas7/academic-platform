
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './apps/backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDB() {
  console.log('Querying Supabase...');
  const { data, error, count } = await supabase.from('oferta_academica').select('*', { count: 'exact' });

  if (error) {
    console.error('Error querying Supabase:', error);
    return;
  }

  console.log(`Found ${count} rows in oferta_academica.`);
  // console.log('Data:', data);
}

testDB();
