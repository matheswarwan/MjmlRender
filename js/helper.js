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

const debounce = (fn, delay) => {
  let timeOutID;
  return function (...args) {
    if (timeOutID) {
      clearTimeout(timeOutID);
    }
    timeOutID = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

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

// Restore the saved MJML. A new block starts from Hello World.
sdk.getData(function (data) {
  if (data && typeof data.mjml === "string" && data.mjml) {
    lastGoodHtml = typeof data.html === "string" ? data.html : "";
    myCodeMirror.setValue(data.mjml);
  } else {
    myCodeMirror.setValue(getHelloWorldMJML());
    renderMjml();
  }
  // Only listen once the saved MJML is loaded, so restoring it doesn't
  // count as an edit.
  myCodeMirror.on("change", debounce(renderMjml, RENDER_DELAY_MS));
});

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
// the email. Keep everything the email needs from <head> (the <style> blocks
// with the column media queries, Outlook conditional comments, font links),
// drop <meta> and <title>, then add the body. DOMParser builds an inert
// document, so nothing in the output runs or loads while this happens.
function sanitiseHtml(htmlOutput) {
  var doc = new DOMParser().parseFromString(htmlOutput, "text/html");
  var head = "";
  doc.head.childNodes.forEach(function (node) {
    if (node.nodeType === Node.COMMENT_NODE) head += "<!--" + node.data + "-->";
    else if (node.nodeType === Node.ELEMENT_NODE && !/^(META|TITLE)$/.test(node.tagName)) head += node.outerHTML;
  });
  var config = { indent_size: 2, space_in_empty_paren: false, keep_array_indentation: true };
  return html_beautify(head + doc.body.innerHTML, config);
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

  var html = result && result.html ? sanitiseHtml(result.html) : "";
  if (html && !rendersNothing(html)) {
    lastGoodHtml = html;
    sdk.setContent(lastGoodHtml);
    sdk.setData({ mjml: typed, html: lastGoodHtml });
    if (messages.length) showErrors(messages);
    else hideErrors();
  } else {
    sdk.setData({ mjml: typed, html: lastGoodHtml });
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
