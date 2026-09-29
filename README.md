# MjmlRender: an MJML content block for Marketing Cloud

A custom Content Builder block that lets you write responsive emails in [MJML](https://mjml.io) directly inside Salesforce Marketing Cloud. You write MJML in the block editor, and the block compiles it to email-safe HTML in the browser as you type. The HTML becomes the block's content, so it previews and sends like any other HTML block.

## Features

- **MJML editor:** a CodeMirror editor with line numbers, XML/HTML/CSS highlighting and code folding (click the gutter arrows, or press Ctrl-Q).
- **Live render:** compiles to HTML 400 ms after you stop typing, using the browser build of MJML (`js/mjml.js`). No server-side rendering is needed. Each render saves the block once. **Generate** renders and saves straight away.
- **Inline errors:** MJML validation errors appear below the editor, with line number and tag.
- **Safe while you edit:** if the MJML is broken or renders nothing (for example halfway through pasting a new template), the email keeps the last version that rendered, and the message says so. Your MJML is still saved.
- **Bare snippets:** you can paste just sections without `<mjml><mj-body>`, and the block wraps them for rendering.
- **Round-trip editing:** the MJML source is stored in the block's data (`sdk.setData`) next to the generated HTML. Reopening the block brings back your MJML, not just the compiled output.
- **Code Snippets tab:** an extra editor tab with copy-to-clipboard snippets and a short reference for common MJML tags: `mj-body`, `mj-include`, `mj-attributes`, `mj-accordion`, `mj-button`, `mj-image`, `mj-social`.
- **Starter template:** a new block starts with a "Hello World" MJML example.

## How it works

```
Content Builder ── iframe ──▶ index.php → index.html
                               │  CodeMirror editor (MJML)
                               │  mjml(source) → { html, errors }
                               ▼
                      Block SDK: setContent(html)   ← what gets sent
                                 setData({ mjml, html }) ← source kept for re-editing
```

The block is built on the [SFMC Block SDK](https://github.com/salesforce-marketingcloud/blocksdk) (`js/blocksdk.js`). The editor logic is in `js/helper.js`.

MJML returns a whole HTML document, but a block is a fragment of the email. So the block keeps what the email needs from `<head>`: the `<style>` blocks with the column media queries, the Outlook conditional comments and the font links. It drops `<meta>` and `<title>` and adds the body. Parsing uses `DOMParser`, so nothing in your MJML runs or loads inside the editor.

## Setup

### 1. Host it

The block is static files served over HTTPS. The live copy is on Cloudflare Pages at https://mjmlrender.pages.dev, which deploys automatically from `main`, so **merging to `main` updates the block for everyone using it**. Pull requests get their own preview URL.

Any static host works, with `index.html` as the entry point. The Code Snippets tab is loaded from the same host automatically.

`index.php` is only for PHP hosts. It adds no-cache headers and `Access-Control-Allow-Origin` for the `mc.*.exacttarget.com` origins listed in `$allowed_domains`, so add your stack there if you use it.

### 2. Register it in Marketing Cloud

1. **Setup → Apps → Installed Packages → New**, then **Add Component → Custom Content Block**.
2. Set the endpoint to your hosted URL (the one serving `index.php`).
3. Open Content Builder, create an email and drag the new block from **Custom** in the block list.

## Project structure

```
index.html          block UI: editor, error box, script includes
js/helper.js        CodeMirror setup, MJML render, Block SDK wiring
index.php           optional entry point for PHP hosts: CORS and no-cache headers
CodeSnippets.html   "Code Snippets" editor tab with copyable MJML examples
mjmldoc.js          tag titles and descriptions used by the snippets tab
js/mjml.js          browser bundle of MJML
js/blocksdk.js      Salesforce Marketing Cloud Block SDK (blocksdk.js is an older copy)
CodeMirror/         vendored CodeMirror (xml, htmlmixed, css, javascript modes, folding)
tests/              headless-browser tests with a stand-in Block SDK
slds/               Salesforce Lightning Design System styles
htmlBeautify.html   scratch page for testing js-beautify output
```

## Tests

```sh
cd tests
npm install
npx playwright install chromium
npm test
```

The tests load the real block in headless Chromium, with a stand-in Block SDK (`tests/mock-sdk.js`) that records what the block saves. They cover:
- Hello World on a new block;
- two-column layouts staying side by side;
- one save per pause in typing;
- broken or empty MJML keeping the last good email;
- error display;
- that nothing in the MJML runs inside the editor;
- bare snippets;
- reopening a saved block.

## Known limitations

- **MJML version:** `js/mjml.js` is a vendored build from 2022 and hasn't been updated since.
- **`mj-include` isn't supported:** the block renders in your browser and can't read other files. It warns you if you use one.
- **Allowed stacks:** `index.php`'s list of Marketing Cloud origins is hardcoded (only relevant on PHP hosts).

## Roadmap ideas

- Update to the current MJML browser build
- Template picker with a few starter layouts

## History

This block started as [`test-contentsdk`](https://github.com/matheswarwan/test-contentsdk) (2021 to 2022) and continued here from April 2022. Everything from that repo worth keeping is in this one.
