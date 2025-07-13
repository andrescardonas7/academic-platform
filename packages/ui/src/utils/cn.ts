// Utilidad para componer clases condicionales (KISS, DRY, Clean Code)
export function cn(
  ...classes: Array<string | undefined | false | null>
): string {
  return classes.filter(Boolean).join(' ');
}
