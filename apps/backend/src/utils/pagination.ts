type PaginationQuery = { page?: string | number; limit?: string | number };

// Utilidad para paginación reutilizable en controladores
export function getPaginationParams(
  query: PaginationQuery,
  defaultLimit = 20,
  maxLimit = 100
) {
  const page = parseInt(query.page as string) || 1;
  const limit = Math.min(
    maxLimit,
    parseInt(query.limit as string) || defaultLimit
  );
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}
