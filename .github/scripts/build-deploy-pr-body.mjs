#!/usr/bin/env node
import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

const changesetDir = '.changeset'
const files = readdirSync(changesetDir)
  .filter((f) => f.endsWith('.md') && f !== 'README.md')
  .sort()

if (files.length === 0) {
  process.exit(0)
}

// Group changesets by package
const byPackage = new Map()

for (const file of files) {
  const content = readFileSync(join(changesetDir, file), 'utf-8')
  const parts = content.split('---')
  if (parts.length < 3) continue

  const frontmatter = parts[1].trim()
  const description = parts.slice(2).join('---').trim()

  // Parse frontmatter lines like: "@repo/budget-time": patch
  const entries = frontmatter.split('\n').filter((l) => l.trim())
  for (const entry of entries) {
    const match = entry.match(/^"?([^"]+)"?\s*:\s*(\w+)/)
    if (!match) continue
    const [, pkg, bump] = match

    if (!byPackage.has(pkg)) {
      byPackage.set(pkg, { bump, descriptions: [] })
    } else {
      // Upgrade bump level if higher
      const existing = byPackage.get(pkg)
      const levels = { patch: 0, minor: 1, major: 2 }
      if ((levels[bump] || 0) > (levels[existing.bump] || 0)) {
        existing.bump = bump
      }
    }

    if (description) {
      byPackage.get(pkg).descriptions.push(description)
    }
  }
}

// Build PR body
let body = '## 🚀 Pending Deployment\n\n'
body += `**${byPackage.size} package(s)** with unreleased changes on \`main\`.\n\n`

for (const [pkg, { bump, descriptions }] of byPackage) {
  const allDesc = descriptions.join('\n\n')

  if (allDesc) {
    body += `<details>\n`
    body += `<summary><strong>${pkg}</strong> — <code>${bump}</code></summary>\n\n`
    body += `${allDesc}\n\n`
    body += `</details>\n\n`
  } else {
    body += `- **${pkg}** — \`${bump}\` _(no description)_\n`
  }
}

// Diff stats vs deploy/production
try {
  execSync('git fetch origin deploy/production', { stdio: 'pipe' })
  const changed = execSync(
    'git diff --name-only origin/deploy/production..origin/main',
    { encoding: 'utf-8' }
  )
    .split('\n')
    .filter(Boolean)
    .map((f) => f.match(/^(apps|packages)\/[^/]+/)?.[0])
    .filter(Boolean)
  const unique = [...new Set(changed)].sort()

  if (unique.length > 0) {
    body += '---\n\n### Affected apps/packages\n\n'
    for (const dir of unique) {
      body += `- \`${dir}\`\n`
    }
    body += '\n'
  }

  const stats = execSync(
    'git diff --stat origin/deploy/production..origin/main',
    { encoding: 'utf-8' }
  )
    .split('\n')
    .filter(Boolean)
    .pop()
  if (stats) {
    body += `\`\`\`\n${stats.trim()}\n\`\`\`\n\n`
  }
} catch {
  // No deploy/production branch yet
}

body += '---\n\n'
body += '_Merge this PR to deploy all pending changes to production._\n'
body += '_Auto-updated on every push to main._\n'

writeFileSync('/tmp/pr-body.md', body)
console.log(body)
