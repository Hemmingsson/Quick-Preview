# Install a downloaded build

[← README](../README.md)

## Chrome

Unzip the Chrome package. Open `chrome://extensions`, enable **Developer mode**, choose **Load unpacked**, and select the folder containing `manifest.json`. Refresh SoundCloud.

The Chrome Web Store is the simplest route for automatic updates.

## Firefox

The Firefox ZIP is ready for submission to Mozilla Add-ons. Until Mozilla signs it, it supports temporary testing: unzip it, open `about:debugging#/runtime/this-firefox`, choose **Load Temporary Add-on**, and select `manifest.json`. Temporary installs disappear when Firefox restarts. Requires Firefox 142 or newer.

A normal direct installer must be a Mozilla-signed XPI. A public Mozilla listing and a signed direct download can be offered once the submission is approved.

## Safari on Mac

The Mac ZIP contains a universal Intel/Apple Silicon app signed with Mattias Hemmingsson’s Developer ID. It has not been notarized, so it is not yet a finished public installer. Do not bypass macOS security warnings to install it.

After notarization, unzip it, move **Quick Preview.app** to Applications, open it, and enable Quick Preview in **Safari → Settings → Extensions**. Allow access to SoundCloud and refresh the page.

The Safari source ZIP contains the Xcode project for macOS and iOS. The raw Safari extension ZIP is build input for Apple’s packager, not an installer. App Store distribution requires a separate archive and App Store Connect submission.

## Build for another browser

```sh
npm run build:firefox
npm run build:safari
```

The outputs are `.output/firefox-mv3/` and `.output/safari-mv3/`.
