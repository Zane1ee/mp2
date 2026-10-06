export const CATALOG_SIZE = 60

export function parsePokemonId(value: string | undefined): number | null {
  if (!value || !/^[1-9]\d*$/.test(value)) return null
  const id = Number(value)
  return Number.isSafeInteger(id) && id <= CATALOG_SIZE ? id : null
}

export function formatNumber(id: number): string {
  return `#${String(id).padStart(3, '0')}`
}

export function displayName(name: string): string {
  return name.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}
