import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

test('the Chrome build contains the MV3 popup, icons and content scripts', () => {
  const directory = '.output/chrome-mv3'
  const manifest = JSON.parse(readFileSync(join(directory, 'manifest.json'), 'utf8'))
  assert.equal(manifest.manifest_version, 3)
  assert.ok(manifest.permissions.includes('storage'))
  assert.ok(manifest.content_scripts.some(script => script.matches.includes('https://soundcloud.com/*')))

  const files = [
    manifest.action.default_popup,
    ...Object.values(manifest.icons),
    ...manifest.content_scripts.flatMap(script => [...script.js ?? [], ...script.css ?? []]),
  ]
  for (const file of files) {
    const path = join(directory, file)
    assert.ok(statSync(path).isFile(), file)
    if (file.endsWith('.js')) execFileSync(process.execPath, ['--check', path])
  }
})
