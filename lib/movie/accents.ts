/** Muted, jewel-toned accents cycled through poster cards and review quotes. Kept deliberately restrained. */
export const accents = ["#c9a45c", "#6fa8a4", "#b8606d", "#9bb08a", "#8b97c9"] as const;

export const accentAt = (index: number): string => accents[index % accents.length];
