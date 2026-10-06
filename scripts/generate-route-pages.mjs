import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const dist = resolve('dist')
const index = await readFile(resolve(dist, 'index.html'), 'utf8')
const routes = ['list', 'gallery', ...Array.from({ length: 60 }, (_, index) => `pokemon/${index + 1}`)]
for (const route of routes) {
  const directory = resolve(dist, route)
  await mkdir(directory, { recursive: true })
  await writeFile(resolve(directory, 'index.html'), index)
}
await writeFile(resolve(dist, '404.html'), index)
console.log(`Generated ${routes.length} static route entries and a 404 entry.`)
