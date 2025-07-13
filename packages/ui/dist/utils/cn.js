// Utilidad para componer clases condicionales (KISS, DRY, Clean Code)
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
