export function camelToKebab(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, '$1-$2') // Insère un tiret entre les lettres minuscules et majuscules
    .toLowerCase(); // Convertit tout en minuscules
}

export function camelToKebab2(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Insère un espace entre les lettres minuscules et majuscules
}

export function kebabToCamel(input: string): string {
  return input
    .split('-') // Sépare au niveau des tirets
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1) // Capitalise la première lettre pour le premier mot
        : word.charAt(0).toUpperCase() + word.slice(1) // Capitalise la première lettre des suivants
    )
    .join(''); // Rejoint les mots sans tirets
}

export function kebabToCamel2(input: string): string {
  return input
    .split('-') // Sépare au niveau des tirets
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1) // Capitalise la première lettre pour le premier mot
        : word.charAt(0).toUpperCase() + word.slice(1) // Capitalise la première lettre des suivants
    )
    .join(' '); // Rejoint les mots sans tirets
}

export function wordsToPascalCase(input: string): string {
  return input
    .split(' ') // Sépare les mots par espace
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalise chaque mot
    .join(''); // Rejoint sans espace
}
