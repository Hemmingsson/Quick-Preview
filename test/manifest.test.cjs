const {test}=require('node:test')
const assert=require('node:assert/strict')
const fs=require('node:fs')
const {execFileSync}=require('node:child_process')
test('Manifest V3 source includes all declared files and valid scripts',()=>{
 const m=JSON.parse(fs.readFileSync('src/manifest.json','utf8'))
 assert.equal(m.manifest_version,3)
 const files=[...Object.values(m.icons),...m.content_scripts.flatMap(s=>[...s.js||[],...s.css||[]])]
 if(m.action.default_popup)files.push(m.action.default_popup)
 for(const file of files){assert.ok(fs.existsSync('src/'+file),file);if(file.endsWith('.js'))execFileSync(process.execPath,['--check','src/'+file])}
})
