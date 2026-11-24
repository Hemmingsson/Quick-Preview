const {test}=require('node:test')
const assert=require('node:assert/strict')
const vm=require('node:vm')
const fs=require('node:fs')
function setup(){
 let xhr
 const events={}
 class Audio{addEventListener(name,fn){events[name]=fn}pause(){}load(){}removeAttribute(){}}
 const ctx=vm.createContext({Audio,sentinel:{on(){}},document:{},setTimeout,XMLHttpRequest:class{constructor(){xhr=this}open(){}send(){}}})
 vm.runInContext(fs.readFileSync('src/inject/inject.js','utf8'),ctx)
 return {ctx,events,get xhr(){return xhr}}
}
test('a delayed response cannot replace a newer preview',async()=>{
 const app=setup();app.ctx.currentPreview={url:'https://soundcloud.com/old'}
 app.ctx.getAndSetPreviewPlayerSrc()
 app.ctx.currentPreview={url:'https://soundcloud.com/new'}
 app.xhr.status=200;app.xhr.responseText=JSON.stringify({kind:'track',stream_url:'https://example.com/old'})
 app.xhr.onload();await new Promise(setImmediate)
 assert.equal(app.ctx.previewPlayer.src,undefined)
})
test('late player events after cancellation are harmless',()=>{
 const app=setup();app.ctx.currentPreview=null
 assert.doesNotThrow(()=>app.events.playing())
 assert.doesNotThrow(()=>app.ctx.failedPreview())
})
test('network errors settle a lookup',async()=>{
 const app=setup();const result=app.ctx.resolveSoundCloudUrl('https://soundcloud.com/track')
 app.xhr.onerror();assert.equal(await result,null)
})
test('an empty playlist has no preview URL',()=>{
 assert.equal(setup().ctx.getStreamUrl({kind:'playlist',tracks:[]}),undefined)
})
