import { defineConfig } from 'wxt'

const icons = Object.fromEntries([16, 32, 48, 128].map(size => [size, `icons/icon${size}.png`]))

export default defineConfig({
  modules: ['@wxt-dev/module-svelte'],
  manifest: {
    name: 'Quick Preview for Soundcloud',
    description: 'Hover a SoundCloud play button to preview a track.',
    permissions: ['storage'],
    icons,
    action: { default_icon: icons },
  },
})
