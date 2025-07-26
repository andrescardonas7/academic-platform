const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkData() {
  console.log('🔍 Verificando datos en Supabase...\n');

  // Buscar ingenierías
  const { data: ingenierias, error: ingError } = await supabase
    .from('oferta_academica')
    .select('carrera, institucion, clasificacion')
    .ilike('carrera', '%ingenieria%');

  console.log('📊 Ingenierías encontradas:', ingenierias?.length || 0);
  ingenierias?.forEach((item) =>
    console.log(`- ${item.carrera} (${item.institucion})`)
  );

  // Mostrar todos los programas
  const { data: all, error: allError } = await supabase
    .from('oferta_academica')
    .select('carrera, institucion')
    .order('carrera');

  console.log('\n📋 Todos los programas disponibles:');
  all?.forEach((item) =>
    console.log(`- ${item.carrera} (${item.institucion})`)
  );

  // Buscar por palabras clave técnicas
  const keywords = [
    'sistemas',
    'software',
    'tecnologia',
    'tecnico',
    'electronica',
  ];
  for (const keyword of keywords) {
    const { data: results } = await supabase
      .from('oferta_academica')
      .select('carrera, institucion')
      .ilike('carrera', `%${keyword}%`);

    if (results?.length > 0) {
      console.log(`\n🔍 Programas con "${keyword}":`);
      results.forEach((item) =>
        console.log(`- ${item.carrera} (${item.institucion})`)
      );
    }
  }
}

checkData().catch(console.error);
