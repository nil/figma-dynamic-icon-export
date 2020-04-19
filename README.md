# Dynamic Icon Export

[![Version](https://img.shields.io/github/package-json/v/nil/figma-dynamic-icon-export)](https://github.com/nil/figma-dynamic-icon-export)
[![Dependencies status](https://img.shields.io/david/nil/figma-dynamic-icon-export)](https://david-dm.org/nil/figma-dynamic-icon-export)
[![Dev dependencies status](https://img.shields.io/david/dev/nil/figma-dynamic-icon-export)](https://david-dm.org/nil/figma-dynamic-icon-export?type=dev)
[![License](https://img.shields.io/github/license/nil/figma-dynamic-icon-export)](http://https://github.com/nil/figma-dynamic-icon-export/blob/master/LICENSE)

A Figma plugin to export multiple frames as an SVG with a single path. No need to manually clone the frame, detach the instances, outline the vectors and flatten them, Dynamic Icon Export does this for you without modifying the original frame, so you can still edit the icon in the future.

Install on Figma

## How does it work

_WIP_

## Features roadmap

- [x] Export the same icon on multiple sizes
- [ ] Export components too
- [ ] Add option to not automatically export icons
- [ ] Add option to not have the size explicitly in the icon name
- [ ] Create components containing the resulting SVG code
- [ ] Optimize the icon with SVGO before exporting
- [ ] Hide some layers when exporting
- [ ] Show list of exported icons on the UI

## Local development

Dynamic Icon Export is wrote using the [Figma Plugin API](https://www.figma.com/plugin-docs/intro/) with [TypeScript](https://www.figma.com/plugin-docs/typescript/), as recommended by them. The UI is build with [React](https://reactjs.org/) to create an interactive and reactive interface and it also uses [PostCSS](https://postcss.org/), as I personally like to write CSS with nested selectors.

To begin local development of the plugin, first clone the repository:

```sh
git clone https://github.com/nil/figma-dynamic-icon-export

cd figma-dynamic-icon-export
```

Then install all the dependencies and run Webpack:

```sh
npm install

npm run serve
```

Finally, install the plugin locally:

1. Open the desktop app and go to `Plugins`.
2. Click on the `+` next to `Development` on the right sidebar.
3. Choose the `manifest.json` inside the figma-dynamic-icon-export you have just cloned.
4. Run the plugin by going to `Menu > Plugins > Development > Dynamic Icon Export`.

# License

Copyright © 2020 Nil Vila. Released under the [MIT License](http://https://github.com/nil/figma-dynamic-icon-export/blob/master/LICENSE).
