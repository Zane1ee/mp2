const pokemonTypes = new Set(['normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost',
  'dragon', 'dark', 'steel', 'fairy'])

export function isPokemonType(type: string): boolean {
  return pokemonTypes.has(type)
}
