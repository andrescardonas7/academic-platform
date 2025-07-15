# PBI-003: Migración a Supabase

## Objetivo
Migrar la configuración backend de SQLite a Supabase para optimizar rendimiento, simplificar deploy en Vercel y reducir complejidad de mantenimiento, preservando la funcionalidad actual.

## Alcance
- Configurar proyecto Supabase
- Migrar esquemas de base de datos de Prisma a Supabase
- Adaptar backend para usar Supabase Client
- Mantener compatibilidad con configuración SQLite existente
- Configurar variables de entorno para Vercel

## Criterios de Aceptación
- Supabase configurado y conectado desde el backend
- Endpoint /health funcional con Supabase
- Variables de entorno configuradas para Vercel
- Documentación de migración completa
- Backup de configuración SQLite preservado

## CoS Test (Definition of Done)
- [ ] Proyecto Supabase creado y configurado
- [ ] Esquemas migrados de Prisma a Supabase
- [ ] Backend conecta exitosamente a Supabase
- [ ] Endpoint /health funciona con nueva configuración
- [ ] Variables de entorno configuradas para Vercel
- [ ] Documentación de migración actualizada

## Beneficios Esperados
- Deploy más rápido en Vercel
- Mejor rendimiento (edge computing)
- Menos configuración de testing
- Escalabilidad automática
- Reducción de costos de mantenimiento
