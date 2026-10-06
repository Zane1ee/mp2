import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { homedir } from 'node:os'
import { createHash } from 'node:crypto'

const [input, expectedSessionId] = process.argv.slice(2)
if (!input || !expectedSessionId) {
  throw new Error('Usage: node scripts/export-chatlog.mjs <session.jsonl> <expected-session-id>')
}
const raw = await readFile(resolve(input), 'utf8')
const lines = raw.trimEnd().split('\n')
const records = []
for (let index = 0; index < lines.length; index += 1) {
  try { records.push(JSON.parse(lines[index])) }
  catch (error) { if (index !== lines.length - 1) throw error }
}
const session = records.find((record) => record.type === 'session_meta')?.payload
if (session?.id !== expectedSessionId) throw new Error('Session identity does not match the requested project chat.')

const project = resolve('.')
const output = resolve('docs/llm/mp2-chatlog.md')
let messages = 0
let calls = 0
let redactions = 0
function sanitize(text) {
  let result = text.replace(/<in-app-browser-context\b[\s\S]*?<\/in-app-browser-context>/g, '')
    .replace(/<environment_context>[\s\S]*?<\/environment_context>/g, '')
    .replace(/<external_codex_apps_open_page>[\s\S]*?<\/external_codex_apps_open_page>/g, '')
    .replaceAll(project, '<MP2_ROOT>')
    .replaceAll(session.cwd, '<INITIAL_WORKSPACE>')
    .replaceAll(homedir(), '<USER_HOME>')
  for (const pattern of [/sk-[A-Za-z0-9_-]{20,}/g, /gh[pousr]_[A-Za-z0-9]{20,}/g,
    /github_pat_[A-Za-z0-9_]{20,}/g, /AKIA[A-Z0-9]{16}/g,
    /-----BEGIN [^-]*PRIVATE KEY-----[\s\S]*?-----END [^-]*PRIVATE KEY-----/g]) {
    result = result.replace(pattern, () => { redactions += 1; return '[CREDENTIAL REDACTED]' })
  }
  return result.trim()
}
const sections = []
for (const record of records) {
  if (record.type !== 'response_item') continue
  const item = record.payload
  if (item.type === 'message' && ['user', 'assistant'].includes(item.role) && !['analysis', 'summary'].includes(item.channel)) {
    const text = sanitize((item.content ?? []).filter((part) => typeof part.text === 'string')
      .map((part) => part.text).join('\n\n'))
    if (!text) continue
    messages += 1
    sections.push(`## ${record.timestamp} · ${item.role}\n\n\`\`\`\`text\n${text}\n\`\`\`\`\n`)
  } else if (item.type === 'custom_tool_call' || item.type === 'function_call') {
    calls += 1
    const body = sanitize(item.input ?? item.arguments ?? '')
    sections.push(`## ${record.timestamp} · assistant tool call: ${item.name}\n\n\`\`\`\`text\n${body}\n\`\`\`\`\n`)
  }
}
const capturedThrough = records.at(-1)?.timestamp ?? 'Unknown'
const header = `# MP2 actual conversation record\n\n`+
  `Session: ${session.id}\n\nExported: ${new Date().toISOString()}\n\n`+
  `Captured through: ${capturedThrough}\n\n`+
  `Source snapshot SHA-256: ${createHash('sha256').update(raw).digest('hex')}\n\n`+
  `Visible user/assistant messages: ${messages}. Assistant tool calls: ${calls}. Credential redactions: ${redactions}.\n\n`+
  `This is a local export of the actual recorded messages and tool-call code/arguments, not a reconstructed narrative. `+
  `Home/project paths are anonymized. Automatic ambient browser/environment blocks, system/developer messages, `+
  `internal reasoning, tool responses, external webpage bodies, and binary media are excluded. `+
  `The snapshot ends at the stated checkpoint; regenerate it before final submission if additional MP2 work or submission-related messages occur.\n\n`
await mkdir(dirname(output), { recursive: true })
await writeFile(output, header + sections.join('\n'))
await writeFile(resolve('llm_logs.csv'), 'conversation,log_path,scope\n'+
  'MP2 planning and implementation,docs/llm/mp2-chatlog.md,"Actual local conversation through the documented export checkpoint"\n')
console.log(`Exported ${messages} actual messages and ${calls} assistant tool calls to docs/llm/mp2-chatlog.md; credential redactions: ${redactions}.`)
