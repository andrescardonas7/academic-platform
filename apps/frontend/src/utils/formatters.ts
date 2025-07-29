/**
 * Utility functions for formatting data
 * Follows DRY principle by centralizing common formatting logic
 */

/**
 * Formats currency values consistently across the application
 * @param amount - The amount to format
 * @returns Formatted currency string or "Consultar" for zero values
 */
export const formatCurrency = (amount: number): string => {
  if (amount === 0) return 'Consultar';

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats price for display with localized number formatting
 * @param amount - The amount to format
 * @returns Formatted price string or "Consultar" for zero values
 */
export const formatPrice = (amount: number): string => {
  if (amount === 0) return 'Consultar';
  return amount.toLocaleString('es-CO');
};

/**
 * Formats duration in semesters to years and semesters
 * @param semesters - Number of semesters
 * @returns Formatted duration string
 */
export const formatDuration = (semesters: number): string => {
  const years = Math.ceil(semesters / 2);
  return `${years} año${years !== 1 ? 's' : ''} (${semesters} semestres)`;
};

/**
 * Gets appropriate color class for academic level
 * @param level - Academic level
 * @returns Tailwind CSS gradient class
 */
export const getLevelColor = (level: string): string => {
  switch (level.toLowerCase()) {
    case 'pregrado':
      return 'from-blue-500 to-cyan-500';
    case 'posgrado':
      return 'from-purple-500 to-pink-500';
    case 'maestría':
      return 'from-green-500 to-emerald-500';
    case 'doctorado':
      return 'from-red-500 to-orange-500';
    default:
      return 'from-gray-500 to-slate-500';
  }
};
