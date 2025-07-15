# Migración a Supabase - Scripts SQL

## Pasos para ejecutar en Supabase:

### 1. Ir al Dashboard de Supabase

- Ve a: https://supabase.com/dashboard/project/vdfbwysgitaswfhxlfoz
- En el menú lateral, ve a **SQL Editor**

### 2. Ejecutar el script SQL

- Copia el contenido de `schema.sql`
- Pégalo en el SQL Editor
- Haz clic en **Run** para ejecutar

### 3. Verificar las tablas

- Ve a **Table Editor** en el menú lateral
- Deberías ver las tablas: `institutions`, `careers`, `programs`

### 4. Probar la conexión

- Una vez creadas las tablas, el endpoint `/api/test` debería funcionar

## Estructura de tablas creadas:

- **institutions**: Información de instituciones académicas
- **careers**: Carreras/programas académicos
- **programs**: Programas específicos con precios y modalidades

## Notas:

- Las tablas tienen Row Level Security (RLS) habilitado
- Políticas de acceso público configuradas para lectura
- Triggers automáticos para `updated_at`
