-- Academic Platform Database Schema for Supabase
-- Migrated from SQLite oferta_academica structure
-- Enable UUID extension for better ID generation (optional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Create ENUM types for better data integrity
CREATE TYPE modalidad_type AS ENUM ('Presencial', 'Híbrida', 'Virtual', 'Mixta');
CREATE TYPE jornada_type AS ENUM (
  'Diurna',
  'Nocturna',
  'Mixta',
  'Sabatina',
  'Virtual'
);
-- Main table: oferta_academica (matching SQLite structure exactly)
CREATE TABLE oferta_academica (
  "Id" TEXT PRIMARY KEY,
  institucion TEXT NOT NULL,
  clasificacion TEXT,
  nivel_programa TEXT,
  carrera TEXT NOT NULL,
  duracion_semestres INTEGER,
  modalidad modalidad_type,
  jornada jornada_type,
  enlace TEXT,
  valor_semestre INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create indexes for better performance
CREATE INDEX idx_oferta_institucion ON oferta_academica(institucion);
CREATE INDEX idx_oferta_carrera ON oferta_academica(carrera);
CREATE INDEX idx_oferta_modalidad ON oferta_academica(modalidad);
CREATE INDEX idx_oferta_clasificacion ON oferta_academica(clasificacion);
CREATE INDEX idx_oferta_nivel ON oferta_academica(nivel_programa);
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ language 'plpgsql';
-- Add trigger for updated_at
CREATE TRIGGER update_oferta_updated_at BEFORE
UPDATE ON oferta_academica FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Enable Row Level Security (RLS)
ALTER TABLE oferta_academica ENABLE ROW LEVEL SECURITY;
-- Create policies for public read access
CREATE POLICY "Allow public read access to oferta_academica" ON oferta_academica FOR
SELECT USING (true);
-- Create policies for authenticated users (future use)
CREATE POLICY "Allow authenticated users to create oferta_academica" ON oferta_academica FOR
INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update oferta_academica" ON oferta_academica FOR
UPDATE USING (auth.role() = 'authenticated');
