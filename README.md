# Quick Preview for SoundCloud

Quickly check out tracks and mixes before you hit play.
Hover a play button to hear a few samples. Pick how many and how long in the preferences.

![Quick Preview for SoundCloud](https://i.imgur.com/YFPk7VO.jpg)

## Install

[Get it on the Chrome Web Store](https://chrome.google.com/webstore/detail/quick-preview-for-soundcl/lghceigagnfccdnkpdfbbhjjegijbjmp).

## Development

```sh
npm ci
npm run build
```

Open `chrome://extensions`, turn on **Developer mode**, and **Load unpacked** → `.output/chrome-mv3/`. Refresh SoundCloud and you're ready.

`npm run dev` for development, `npm test` to run the tests.

[Usage](docs/usage.md) · [How it works](docs/architecture.md) · [Development notes](docs/development.md)
