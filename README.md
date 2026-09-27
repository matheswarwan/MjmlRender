# MjmlRender: an MJML content block for Marketing Cloud

A custom Content Builder block that lets you write responsive emails in [MJML](https://mjml.io) directly inside Salesforce Marketing Cloud. You write MJML in the block editor, and the block compiles it to email-safe HTML in the browser as you type. The HTML becomes the block's content, so it previews and sends like any other HTML block.

## Features

- **MJML editor:** a CodeMirror editor with line numbers and XML/HTML highlighting.
- **Live render:** compiles to HTML on every change, debounced, using the browser build of MJML (`js/mjml.js`). No server-side rendering is needed.
- **Inline errors:** MJML validation errors appear above the editor with line number and tag.
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

The block is built on the [SFMC Block SDK](https://github.com/salesforce-marketingcloud/blocksdk) (`blocksdk.js`). `index.php` serves `index.html`. It also sets no-cache headers and returns `Access-Control-Allow-Origin` for Marketing Cloud's `mc.*.exacttarget.com` origins.

## Setup

### 1. Host it

The block has to be served over HTTPS from a host that runs PHP, with `index.php` as the entry point. It was originally hosted on Heroku.

The Code Snippets tab URL is hardcoded in `index.html`:

```js
url: "https://mjmlrender.herokuapp.com/CodeSnippets.html",
```

If you host the block somewhere else, change this URL to match.

If your Marketing Cloud stack isn't listed in `$allowed_domains` in `index.php`, add it (for example `https://mc.s50.exacttarget.com/`).

### 2. Register it in Marketing Cloud

1. **Setup → Apps → Installed Packages → New**, then **Add Component → Custom Content Block**.
2. Set the endpoint to your hosted URL (the one serving `index.php`).
3. Open Content Builder, create an email and drag the new block from **Custom** in the block list.

## Project structure

```
index.php           entry point: CORS and no-cache headers, includes index.html
index.html          block UI, CodeMirror setup, MJML render and Block SDK wiring
CodeSnippets.html   "Code Snippets" editor tab with copyable MJML examples
mjmldoc.js          tag titles and descriptions used by the snippets tab
js/mjml.js          browser bundle of MJML
blocksdk.js         Salesforce Marketing Cloud Block SDK
CodeMirror/         vendored CodeMirror (xml, htmlmixed, javascript modes)
slds/               Salesforce Lightning Design System styles
htmlBeautify.html   scratch page for testing js-beautify output
```

## Known limitations

- **Hosting URL:** the snippets tab URL and the list of allowed Marketing Cloud stacks are hardcoded.
- **No sample-template picker:** "Starwars" and "Hello World" template buttons exist in the code but are commented out.
- **MJML version:** `js/mjml.js` is a vendored build from 2022 and hasn't been updated since.
- **Tests:** there are no automated tests.

## Roadmap ideas

- Move hosting config (snippets URL, allowed stacks) into one settings file
- Update to the current MJML browser build
- Template picker with a few starter layouts
- Merge with the `test-contentsdk` experiments into a single maintained block
