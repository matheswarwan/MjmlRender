var elt = document.getElementById("editing");
var myCodeMirror = CodeMirror.fromTextArea(elt, {
  lineNumbers: true,
  mode: "xml",
  htmlMode: true,
  lineSeparator: null,
  theme: "default",
  indentUnit: 2,
  tabSize: 4,
  indentWithTabs: true,
  tabindex: 1,
  autofocus: true,
  gutter: true,
  lineWrapping: true,
  foldGutter: true,
  autoRefresh: true,
  gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  extraKeys: { "Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); } },
});
myCodeMirror.setSize("100%", "100%");
myCodeMirror.refresh();

var debug = false;
var RENDER_DELAY_MS = 400;

// The last HTML that rendered cleanly. While the MJML is broken (for example
// half-way through pasting a new template) the block keeps showing this
// instead of a placeholder or an empty email.
var lastGoodHtml = "";

// What the block writes besides the email body (review: with several MJML blocks
// in one email, each one repeated MJML's head output). "email" is the whole-email
// output this block always had, and stays the default so existing blocks keep it.
var PRESETS = {
  email: { reset: true, outlook: true, fonts: true, media: true, wrapper: true },
  part: { reset: false, outlook: false, fonts: true, media: true, wrapper: false },
};
var OPTION_KEYS = ["reset", "outlook", "fonts", "media", "wrapper"];
var options = Object.assign({}, PRESETS.email);

function readOptions(saved) {
  var out = Object.assign({}, PRESETS.email);
  if (saved && typeof saved === "object") {
    OPTION_KEYS.forEach(function (k) { if (typeof saved[k] === "boolean") out[k] = saved[k]; });
  }
  return out;
}

function presetOf(opts) {
  return Object.keys(PRESETS).find(function (name) {
    return OPTION_KEYS.every(function (k) { return PRESETS[name][k] === opts[k]; });
  }) || "custom";
}

function showOptions() {
  document.getElementById("outputMode").value = presetOf(options);
  OPTION_KEYS.forEach(function (k) { document.getElementById("opt-" + k).checked = options[k]; });
}

document.getElementById("outputMode").addEventListener("change", function () {
  if (PRESETS[this.value]) options = Object.assign({}, PRESETS[this.value]);
  showOptions();
  renderSoon.cancel();
  renderMjml();
});
OPTION_KEYS.forEach(function (k) {
  document.getElementById("opt-" + k).addEventListener("change", function () {
    options[k] = this.checked;
    showOptions();
    renderSoon.cancel();
    renderMjml();
  });
});
showOptions();

// Copies the HTML the email gets, for people who want to paste it elsewhere.
// Content Builder's iframe may not allow the clipboard API, so fall back to a
// selected textarea.
document.getElementById("copyBtn").addEventListener("click", function () {
  var html = lastGoodHtml;
  var done = function () { flash("Copied the block's HTML."); };
  var fallback = function () {
    var box = document.createElement("textarea");
    box.value = html;
    box.style.position = "fixed";
    box.style.opacity = "0";
    document.body.appendChild(box);
    box.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    box.remove();
    ok ? done() : flash("Copy was blocked here. Select the text in your browser's console with copy(lastGoodHtml).");
  };
  if (!html) return flash("Nothing has rendered yet.");
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(html).then(done, fallback);
  else fallback();
});

function flash(text) {
  var note = document.getElementById("copyNote");
  note.textContent = text;
  clearTimeout(flash.timer);
  flash.timer = setTimeout(function () { note.textContent = ""; }, 3000);
}

const debounce = (fn, delay) => {
  let timeOutID;
  const debounced = function (...args) {
    if (timeOutID) {
      clearTimeout(timeOutID);
    }
    timeOutID = setTimeout(() => {
      fn(...args);
    }, delay);
  };
  debounced.cancel = () => clearTimeout(timeOutID);
  return debounced;
};

var renderSoon = debounce(renderMjml, RENDER_DELAY_MS);

// Generate renders and saves straight away, without waiting for a pause.
document.getElementById("renderBtn").addEventListener("click", function () {
  renderSoon.cancel();
  renderMjml();
});

var sdk = new window.sfdc.BlockSDK({
  blockEditorWidth: 500,
  tabs: [
    "htmlblock",
    {
      name: "Code Snippets",
      key: "codeSnippets",
      // Served from wherever this block is hosted.
      url: new URL("CodeSnippets.html", window.location.href).href,
    },
    "stylingblock",
  ],
});

hideErrors();
sdk.setBlockEditorWidth(500, function () {});

// Edits render automatically. Loading saved MJML into the editor is not an
// edit, so that one change is skipped.
var restoring = false;
myCodeMirror.on("change", function () {
  if (!restoring) renderSoon();
});

function loadMjml(source) {
  restoring = true;
  myCodeMirror.setValue(source);
  restoring = false;
}

// Restore the saved MJML. A new block starts from Hello World.
sdk.getData(function (data) {
  options = readOptions(data && data.options);
  showOptions();
  if (data && typeof data.mjml === "string" && data.mjml) {
    lastGoodHtml = typeof data.html === "string" ? data.html : "";
    loadMjml(data.mjml);
  } else {
    loadMjml(getHelloWorldMJML());
    renderMjml();
  }
});

// Opened directly rather than inside Content Builder, the Block SDK never
// answers, so show Hello World to have something to edit. Inside Content
// Builder this never runs, so a slow SDK can't replace a saved block.
if (window.self === window.top) {
  loadMjml(getHelloWorldMJML());
  renderMjml();
}

function getHelloWorldMJML() {
var helloWorldmjml = `<mjml>
    <mj-body>
        <mj-section>
        <mj-column>
            <mj-divider border-color="#F45E43"></mj-divider>
            <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello World</mj-text>
        </mj-column>
        </mj-section>
    </mj-body>
</mjml>`;
return helloWorldmjml;
}

// Lets people paste a bare snippet (just sections, say) by wrapping it in
// <mjml><mj-body>. DOMParser keeps the check inert: nothing in the source runs.
function validateMjmlInput(textAreaContent) {
  var doc = new DOMParser().parseFromString(textAreaContent, "text/html");
  if (doc.querySelector("mjml") == null && doc.querySelector("mj-body") == null) {
    textAreaContent = "<mjml><mj-body>" + textAreaContent + "</mj-body></mjml>";
  }
  return textAreaContent;
}


// MJML returns a whole document, but a Content Builder block is a fragment of
// the email. Keep what the options ask for from <head>, drop <meta> and <title>,
// then add the body. DOMParser builds an inert document, so nothing in the output
// runs or loads while this happens.
//   reset    MJML's global CSS for body, table, td, img and p (it changes the
//            whole email, not just this block)
//   outlook  Office XML settings and the Outlook column fix
//   fonts    font <link> and @import lines (Ubuntu is MJML's default font for
//            text and buttons, so it is there unless a font-family is set)
//   media    the column media queries (needed for columns side by side)
//   wrapper  the mj-body <div> with its background colour
// CSS from <mj-style> and comments of the user's own are always kept.
function headPart(node) {
  if (node.nodeType === Node.COMMENT_NODE) {
    var c = node.data;
    if (/o:OfficeDocumentSettings|mj-outlook-group-fix/.test(c)) return "outlook";
    if (/<link\b|@import/.test(c)) return "fonts";
    return "comment";
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return null;
  if (/^(META|TITLE)$/.test(node.tagName)) return null;
  if (node.tagName === "LINK") return "fonts";
  if (node.tagName === "STYLE") {
    var css = node.textContent;
    if (!css.trim()) return null;
    if (/#outlook a\s*\{/.test(css)) return "reset";
    if (/@import/.test(css) && !css.replace(/@import[^;]*;/g, "").trim()) return "fonts";
    if (/@media|\.moz-text-html/.test(css) && /\.mj-column-|mj-full-width-mobile|\.moz-text-html/.test(css)) return "media";
  }
  return "keep";
}

function sanitiseHtml(htmlOutput, opts) {
  opts = opts || PRESETS.email;
  var doc = new DOMParser().parseFromString(htmlOutput, "text/html");
  var head = "";
  doc.head.childNodes.forEach(function (node) {
    var part = headPart(node);
    if (!part || (part in opts && !opts[part])) return;
    head += node.nodeType === Node.COMMENT_NODE ? "<!--" + node.data + "-->" : node.outerHTML;
  });
  // The X-UA-Compatible <meta> is dropped, which leaves its empty "not Outlook"
  // comment pair behind.
  head = head.replace(/<!--\[if !mso\]><!-->\s*<!--<!\[endif\]-->/g, "");
  var body = doc.body;
  var wrapper = body.children.length === 1 && body.firstElementChild.tagName === "DIV" ? body.firstElementChild : null;
  var inner = !opts.wrapper && wrapper ? wrapper.innerHTML : body.innerHTML;
  var config = { indent_size: 2, space_in_empty_paren: false, keep_array_indentation: true };
  return html_beautify(head + inner, config);
}

// True when the body has nothing a reader would see.
function rendersNothing(html) {
  var doc = new DOMParser().parseFromString(html, "text/html");
  return !doc.body.textContent.trim() && !doc.body.querySelector("img, table[background], [style*='background-image']");
}

function showErrors(lines) {
  var box = document.getElementById("errorMsg");
  box.textContent = "";
  lines.forEach(function (line) {
    var row = document.createElement("div");
    row.textContent = line;
    box.appendChild(row);
  });
  document.getElementById("alertBox").style.display = "block";
}

function hideErrors() {
  document.getElementById("errorMsg").textContent = "";
  document.getElementById("alertBox").style.display = "none";
}

function describe(errors) {
  return (errors || []).map(function (e) {
    return "Line " + e.line + ": [" + e.tagName + "] " + e.message;
  });
}

// Renders the editor's MJML and saves it: one setContent and one setData per
// render. Broken MJML is still saved (so no work is lost) but the email keeps
// the last HTML that rendered.
function renderMjml() {
  var typed = myCodeMirror.getValue();
  var source = validateMjmlInput(typed);
  var result = null;
  try {
    result = mjml(source);
  } catch (e) {
    consoleprint(debug, e);
  }
  var messages = result ? describe(result.errors) : [];
  if (/<mj-include\b/i.test(source)) {
    messages.unshift("mj-include is not supported here: the block renders in your browser and cannot read other files.");
  }

  var html = result && result.html ? sanitiseHtml(result.html, options) : "";
  if (html && !rendersNothing(html)) {
    lastGoodHtml = html;
    sdk.setContent(lastGoodHtml);
    sdk.setData({ mjml: typed, html: lastGoodHtml, options: options });
    if (messages.length) showErrors(messages);
    else hideErrors();
  } else {
    sdk.setData({ mjml: typed, html: lastGoodHtml, options: options });
    var why = html ? "This MJML renders an empty email." : "Not valid MJML yet.";
    messages.unshift(lastGoodHtml ? why + " The email still shows the last version that rendered." : why);
    showErrors(messages);
  }
}

function consoleprint(debug, msg) {
  debug ? console.log(msg) : "";
}

var closebtns = document.getElementsByClassName("close");
for (var i = 0; i < closebtns.length; i++) {
  closebtns[i].addEventListener("click", function () {
    this.parentElement.parentElement.style.display = "none";
  });
}
