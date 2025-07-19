-- Supabase Performance Optimization Script
-- Run this in your Supabase SQL Editor

-- 1. Create composite indexes for common search patterns
CREATE INDEX IF NOT EXISTS idx_search_carrera_text ON oferta_academica USING gin(to_tsvector('spanish', carrera));
CREATE INDEX IF NOT EXISTS idx_search_institucion_text ON oferta_academica USING gin(to_tsvector('spanish', institucion));

-- 2. Create composite indexes for filtering
CREATE INDEX IF NOT EXISTS idx_modalidad_nivel ON oferta_academica(modalidad, nivel_programa);
CREATE INDEX IF NOT EXISTS idx_carrera_modalidad ON oferta_academica(carrera, modalidad);
CREATE INDEX IF NOT EXISTS idx_institucion_modalidad ON oferta_academica(institucion, modalidad);

-- 3. Create index for price filtering
CREATE INDEX IF NOT EXISTS idx_valor_semestre ON oferta_academica(valor_semestre) WHERE valor_semestre IS NOT NULL;

-- 4. Create index for duration filtering
CREATE INDEX IF NOT EXISTS idx_duracion_semestres ON oferta_academica(duracion_semestres) WHERE duracion_semestres IS NOT NULL;

-- 5. Create partial indexes for common filters
CREATE INDEX IF NOT EXISTS idx_gratuito ON oferta_academica(carrera, institucion) WHERE valor_semestre = 0;
CREATE INDEX IF NOT EXISTS idx_pregrado ON oferta_academica(carrera, modalidad) WHERE nivel_programa ILIKE '%pregrado%';
CREATE INDEX IF NOT EXISTS idx_posgrado ON oferta_academica(carrera, modalidad) WHERE nivel_programa ILIKE '%posgrado%';

-- 6. Analyze table statistics for better query planning
ANALYZE oferta_academica;

-- 7. Create a materialized view for common aggregations (optional)
CREATE MATERIALIZED VIEW IF NOT EXISTS oferta_stats AS
SELECT
  modalidad,
  nivel_programa,
  COUNT(*) as total_programas,
  AVG(valor_semestre) as promedio_valor,
  MIN(valor_semestre) as valor_minimo,
  MAX(valor_semestre) as valor_maximo
FROM oferta_academica
WHERE valor_semestre IS NOT NULL
GROUP BY modalidad, nivel_programa;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_oferta_stats_modalidad ON oferta_stats(modalidad);

-- Refresh the materialized view
REFRESH MATERIALIZED VIEW oferta_stats;
