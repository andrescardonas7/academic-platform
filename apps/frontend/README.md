# Frontend - Academic Platform

## Consumo de datos

- El frontend consume la oferta académica desde el endpoint `/api/oferta-academica` expuesto por el backend Supabase.
- Se utiliza un API client simple en `/packages/api-client` y un hook personalizado `useAcademicOfferings` para obtener y mostrar los datos.
- Los filtros de modalidad, institución y carrera se aplican en el frontend para mejorar la experiencia de usuario.

## Flujo principal

1. El usuario accede a la página principal.
2. El hook obtiene los datos de la API.
3. El usuario puede filtrar los resultados usando los selectores.
4. Los datos se muestran en una lista o grid.

## Notas

- No se implementa autenticación/login.
- El backend SQLite/Prisma queda solo como referencia histórica.
- El flujo principal es Supabase.
