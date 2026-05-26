# progress indicator
[![tests](https://img.shields.io/github/actions/workflow/status/substrate-system/progress-indicator/nodejs.yml?style=flat-square)](https://github.com/substrate-system/progress-indicator/actions/workflows/nodejs.yml)
[![types](https://img.shields.io/npm/types/@substrate-system/progress-indicator?style=flat-square)](README.md)
[![module](https://img.shields.io/badge/module-ESM%2FCJS-blue?style=flat-square)](README.md)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![install size](https://flat.badgen.net/packagephobia/install/@substrate-system/progress-indicator?cache-control=no-cache)](https://packagephobia.com/result?p=@substrate-system/progress-indicator)
[![gzip size](https://img.shields.io/bundlephobia/minzip/@substrate-system/progress-indicator?style=flat-square)](https://bundlephobia.com/package/@substrate-system/progress-indicator)
[![license](https://img.shields.io/badge/license-Big_Time-blue?style=flat-square)](LICENSE)


See [an article on piccalil.li/blog](https://piccalil.li/blog/solution-009-progress-indicator)

<details><summary><h2>Contents</h2></summary>

<!-- toc -->

- [Install](#install)
- [Example](#example)
- [Use](#use)
  * [render server-side](#render-server-side)
  * [No build tools](#no-build-tools)
  * [Bundle](#bundle)
  * [CSS](#css)
  * [No build tools](#no-build-tools-1)
  * [link in HTML](#link-in-html)
  * [Bundler](#bundler)
  * [CSS Variables](#css-variables)
- [develop](#develop)
  * [SSR](#ssr)

<!-- tocstop -->

</details>

## Install

```sh
npm i -S @substrate-system/progress-indicator
```

## Example

See [./example/index.html](./example/index.html).

See [the demonstration](https://substrate-system.github.io/progress-indicator/).

![screenshot](image.png)

![screenshot 100%](image-1.png)

This takes an attribute `progress`, which is a percent number from 0 - 100.

```js
import { ProgressIndicator } from '@substrate-system/progress-indicator'
import '@substrate-system/progress-indicator/css'

ProgressIndicator.define()
```

```html
<progress-indicator progress="10">
  <div role="alert" aria-live="polite">
    <!-- show this text iff the web component cannot render -->
    <p>Loading, please wait…</p>
  </div>
</progress-indicator>
```

## Use

You've got options.

### render server-side

This is factored as a ["split component"](https://www.spicyweb.dev/web-components-ssr-node/),
which means it is easy to render server-side.

Import from the path `/ssr`. See [./example](./example/ssr/).

#### server

Import and build:

```js
import { outerHTML } from '@substrate-system/progress-indicator/ssr'

// outerHTML takes the standard attributes

const myString = `
  <div id=root>
    ${outerHTML({ progress: 25 })}
  </div>
`
```

#### Client-side

If you pre-render the component server-side, then you can include a "light"
version of the client-side JS, which just attaches event listeners and responds
to attribute changes. It doesn't know how to render itself.

```js
import { define } from '@substrate-system/progress-indicator/client'

define()
```

### No build tools

It is possible to use this without building any JS. The package exposes a
universal module, designed to be consumed directly.

After installing, copy the `/umd.min.js` path to your web server.
It will define the component in the page registry, and any tags in the page
will be hydrated.

#### copy
First copy the file to your server:

```sh
cp ./node_modules/@substrate-system/progress-indicator/dist/umd.min.js ./public/progress-indicator.js
```

```html
<script src="/progress-indicator.js"></script>
```

#### HTML

And now you can use the tag in your markup:

```html
<div id="root">
  <progress-indicator progress="0" stroke="8" viewbox="130">
    <!-- show  this text if we can't render web components -->
    <div role="alert" aria-live="polite">
      <p>Loading, please wait…</p>
    </div>
  </progress-indicator>
</div>
```

### Bundle
If you are using a tool such as `vite`, just import, then use in
your HTML.

#### Include the full version

```js
import { ProgressIndicator } from '@substrate-system/progress-indicator'
import '@substrate-system/progress-indicator/css'

ProgressIndicator.define()
```

#### Include the light version

If you have already rendered server-side.

```js
import { define } from '@substrate-system/progress-indicator/client'
import '@substrate-system/progress-indicator/css'
```

### CSS

Include the CSS also.

### No build tools

You can simply copy the CSS file to your server.

```sh
cp ./node_modules/@substrate-system/progress-indicator/dist/index.css ./public/progress-indicator.css
```

or the minified CSS:

```sh
cp ./node_modules/@substrate-system/progress-indicator/dist/index.min.css ./public/progress-indicator.css
```

### link in HTML

```html
<link rel="stylesheet" href="./progress-indicator.css">
```

### Bundler

If you are using a tool such as vite, add a link to the css from within
your javascript, at the `/css` path.

```js
import '@substrate-system/progress-indicator/css'
```

### CSS Variables

Override these variables in your own CSS to customize the appearance.

```css
:root {
    /* generic variables, used as defaults */
    --font-base: "Space Mono", monospace;
    --transition: 200ms linear;
    --color-dark: #1f1a38;
    --color-dark-glare: #989ea9;
    --color-success: #76f7bf;

    /* component-specific variables */
    --progress-indicator-color-complete: var(--color-success);
    --progress-indicator-progress-stroke: var(--color-dark);
    --progress-indicator-bg-stroke: var(--color-dark-glare);
    --progress-indicator-viewbox: auto;
    --progress-indicator-check-size: 60cqw;
    --progress-indicator-count-size: max(25cqw, 1rem);
}
```

----------------------------------------------------
## develop
----------------------------------------------------

Start a localhost server of the `./example` directory.

```sh
npm start
```

### SSR

Use the `/ssr` path to render a static HTML file, and link to the "light"
version of the client-side JS in HTML, then serve:

```sh
npm run example
```
