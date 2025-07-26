const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Testing Supabase connection...');
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('Service Key:', supabaseServiceKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  try {
    // Test 1: Check oferta_academica table
    console.log('\n📊 Test 1: Checking oferta_academica table...');
    const { data: tableData, error: tableError } = await supabase
      .from('oferta_academica')
      .select('*')
      .limit(1);

    if (tableError) {
      console.log('❌ Table error:', tableError.message);

      // Try alternative table name
      console.log('\n📊 Trying "offerings" table...');
      const { data: altData, error: altError } = await supabase
        .from('offerings')
        .select('*')
        .limit(1);

      if (altError) {
        console.log('❌ Alternative table error:', altError.message);
        console.log('\n💡 Possible solutions:');
        console.log('   1. Check if table exists in Supabase dashboard');
        console.log('   2. Verify table permissions');
        console.log('   3. Import data to the table');
        return;
      } else {
        console.log('✅ Found "offerings" table instead!');
        console.log('📊 Sample data:', JSON.stringify(altData?.[0], null, 2));
        console.log('\n🔧 Update SearchService to use "offerings" table');
        return;
      }
    }

    console.log('✅ Table accessible');
    console.log(
      '📊 Sample data:',
      JSON.stringify(tableData?.[0], null, 2) || 'No data found'
    );

    // Test 2: Count total records
    console.log('\n📊 Test 2: Counting total records...');
    const { count, error: countError } = await supabase
      .from('oferta_academica')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.log('❌ Count error:', countError.message);
      return;
    }

    console.log(`✅ Total records: ${count}`);

    if (count === 0) {
      console.log('⚠️  Warning: No data in table');
      console.log('💡 You need to import data to the oferta_academica table');
    } else {
      console.log('🎉 Chatbot should work with this data!');
    }
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
}

testConnection();
