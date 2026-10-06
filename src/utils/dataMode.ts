export type DataMode = 'live' | 'sample'
export const SAMPLE_IDS = [1, 4, 7, 25, 39, 60] as const

export function parseDataMode(params: URLSearchParams): DataMode {
  return params.get('mode') === 'sample' ? 'sample' : 'live'
}

export function withMode(href: string, mode: DataMode): string {
  const [path, query = ''] = href.split('?')
  const params = new URLSearchParams(query)
  if (mode === 'sample') params.set('mode', 'sample')
  else params.delete('mode')
  return `${path}${params.size ? `?${params}` : ''}`
}

export function isInDataScope(id: number, mode: DataMode): boolean {
  return mode === 'live' || SAMPLE_IDS.some((sampleId) => sampleId === id)
}
