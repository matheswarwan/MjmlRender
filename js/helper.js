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
extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }}
});
myCodeMirror.setSize("100%", "100%");
myCodeMirror.on('change', renderMjml);
myCodeMirror.refresh();

var textAreaContent;
var errMsg;
var debug = true;

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
    url: "https://mjmlrender.pages.dev/CodeSnippets.html",
    },
    "stylingblock"
],
});

document.getElementById("alertBox").style.display = "none";
document.getElementById("errorMsg").innerHTML = "";
sdk.setBlockEditorWidth(500, function (data) {
});

sdk.getContent(function (content) {
if (content) {
    sdk.setContent(content, function (setContent) {
    //Get mjml data from getData and store it 
    sdk.getData(function (data) {
        if(data & data["mjml"]) {
        myCodeMirror.setValue(data["mjml"]);
        }
    });
    });
} else {
    var helloWorldmjml = getHelloWorldMJML();
    var helloWorldHtml = getHelloWorldHTML();
    sdk.setContent(
    //"No html available to preview",
    html_beautify(helloWorldHtml) + "<!-- Beautified --> ",
    function (){
        myCodeMirror.setValue(helloWorldmjml);
        var initialData = {};
        initialData["mjml"] = helloWorldmjml;
        initialData["html"] = helloWorldHtml;
        sdk.setData(initialData)
    }
    /* function (setContent) {
        sdk.getData(function (data) {
        if (data["html"]) {
            sdk.setContent(data["html"]);
        } else {
            sdk.setContent("");
        }
        });
    } */
    );
}
});

sdk.getData(function (data) {
if (!isEmptyObject(data) && data["mjml"]) {
    myCodeMirror.setValue(data.mjml);
}
});

sdk.getUserData(function (userData) {
});

function fnCallback(data) {
consoleprint(debug, data);
}

function mjmlHelloWorld() {
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
myCodeMirror.setValue(helloWorldmjml);

sdk.getContent(function (data) {
    data["mjml"] = helloWorldmjml;
    sdk.setContent(
    "Preview not available. Please click on render to generate HTML preview."
    ); 
});
sdk.getData(function (data) {
    data["mjml"] = helloWorldmjml;
    data["html"] = renderMjml();
    sdk.setData(data);
});
}

function mjmlStarWarsTemplate() {
var mjmlStarWars = `<mjml>
<mj-head>
<mj-title>These are the Droids you're looking for</mj-title>
</mj-head>
<mj-body>
<mj-raw>
<!-- Hero image -->
</mj-raw>
<mj-section background-color="#000000" padding="0px">
<mj-column>
<mj-image src="https://dmmedia.sphero.com/email-marketing/Star-Wars/Star_Wars_Launch_Email_1_REAL_Hero.jpg" alt="These Are The Droids You're Looking For" href="https://www.youtube.com/sphero" padding="0px"></mj-image>
</mj-column>
</mj-section>
<mj-raw>
<!-- Features Section -->
</mj-raw>
<mj-section background-color="#000000">
<mj-column>
<mj-image src="https://dmmedia.sphero.com/email-marketing/Star-Wars/Star_Wars_Launch_Email_1_features.jpg" alt="Featuring Authentic Movement, Holographic Simulation, Droid to Droid Experience, and Watch With Me" padding="0px"></mj-image>
</mj-column>
</mj-section>
<mj-raw>
<!-- R2-D2 Section -->
</mj-raw>
<mj-section background-color="#000000" background-url="https://dmmedia.sphero.com/email-marketing/Star-Wars/Star_Wars_Launch_Email_1.r2BG.jpg" background-repeat="no-repeat" padding-top="80px" padding-bottom="0px" padding-left="20px">
<mj-column>
<mj-spacer height="15px"></mj-spacer>
<mj-image src="https://dmmedia.sphero.com/email-marketing/Star-Wars/Star_Wars_Launch_Email_1_R2text.png" width="196px" alt="Buy R2D2" href="https://www.sphero.com/starwars/r2d2"></mj-image>
<mj-text font-size="14px" line-height="2" align="left" color="#ffffff" font-family="Helvetica Neue">This is the Droid™ you’re looking for. R2-D2™ is an Astromech Droid™ in the Rebel Alliance from a galaxy far, far away.... The specialized tech in R2-D2 is unlike any other Astromech Droid, making it as authentic as the trusty Artoo you’ve come
    to know and love.</mj-text>
<mj-spacer height="5px"></mj-spacer>
<mj-image src="https://dmmedia.sphero.com/email-marketing/Star-Wars/Star_Wars_Launch_Email_1_R2_button.png" width="129px" alt="Buy R2-D2" href="https://store.sphero.com/products/r2-d2"></mj-image>
</mj-column>
<mj-column>
<mj-spacer height="45px"></mj-spacer>
<mj-image src="https://dmmedia.sphero.com/email-marketing/Star-Wars/Star_Wars_Launch_Email_1_R2-D2.png" href="https://www.sphero.com/starwars/r2d2" alt="Get the new R2-D2" width="310px" padding="0px"></mj-image>
</mj-column>
</mj-section>
<mj-raw>
<!-- BB-9E Section -->
</mj-raw>
<mj-section background-color="#000000" background-url="https://dmmedia.sphero.com/email-marketing/Star-Wars/Star_Wars_Launch_Email_1REDbg.jpg" background-repeat="no-repeat" padding-left="20px">
<mj-column>
<mj-spacer height="37px"></mj-spacer>
<mj-image src="https://dmmedia.sphero.com/email-marketing/Star-Wars/Star_Wars_Launch_Email_1_BB-9E-text.png" width="196px" alt="Buy BB-9E" href="https://www.sphero.com/starwars/bb9e"></mj-image>
<mj-text font-size="14px" align="left" color="#ffffff" line-height="2" font-family="Helvetica Neue">There’s a new disturbance in the Force. BB-9E™ is a menacing Astromech Droid of the First Order. This vigilant and intimidating Droid is always on high alert. This is NOT the Droid you’re looking for… it’s the Droid that’s looking for you.</mj-text>
<mj-spacer height="30px"></mj-spacer>
<mj-image src="https://dmmedia.sphero.com/email-marketing/Star-Wars/Star_Wars_Launch_Email_1_BB-9E-button.png" width="129px" alt="Buy BB-9E" href="https://store.sphero.com/products/bb-9e"></mj-image>
</mj-column>
<mj-column>
<mj-spacer height="60px"></mj-spacer>
<mj-image src="https://dmmedia.sphero.com/email-marketing/Star-Wars/Star_Wars_Launch_Email_1_bb9e.png" href="https://www.sphero.com/starwars/bb9e" alt="Get the new BB-9E" width="310px" padding="0px"></mj-image>
</mj-column>
</mj-section>
<mj-raw>
<!-- BB-8 Section -->
</mj-raw>
<mj-section background-color="#000000" background-url="https://dmmedia.sphero.com/email-marketing/Star-Wars/Star_Wars_Launch_Email_1_OrangeBG.jpg" background-repeat="no-repeat" padding-top="0" padding-left="20px">
<mj-column>
<mj-spacer height="85px"></mj-spacer>
<mj-image src="https://dmmedia.sphero.com/email-marketing/Star-Wars/Star_Wars_Launch_Email_1_bb8-text.png" width="196px" alt="Buy BB-8" href="https://www.sphero.com/starwars/bb8"></mj-image>
<mj-text font-size="14px" align="left" color="#ffffff" line-height="2" font-family="Helvetica Neue">Orange and white. One of a kind. BB-8™ is the loyal Astromech Droid of Resistance pilot Poe Dameron. The specially designed technology in this unique BB unit makes it invaluable to the Resistance. This Droid is full of features and will stop at
    nothing to complete its mission.</mj-text>
<mj-spacer height="50px"></mj-spacer>
<mj-image src="https://dmmedia.sphero.com/email-marketing/Star-Wars/Star_Wars_Launch_Email_1_bb8-button.png" width="129px" href="https://store.sphero.com/products/bb-8-with-trainer" alt="Buy BB-8"></mj-image>
</mj-column>
<mj-column>
<mj-spacer height="55px"></mj-spacer>
<mj-image src="https://dmmedia.sphero.com/email-marketing/Star-Wars/Star_Wars_Launch_Email_1_bb8.png" href="https://www.sphero.com/starwars/bb8" width="310px" alt="Get the new BB-8" padding="0px"></mj-image>
<mj-spacer height="155px"></mj-spacer>
</mj-column>
</mj-section>
<mj-raw>
<!-- Bottom Bar -->
</mj-raw>
<mj-section background-color="#424143" padding-right="10px" padding-top="0" padding-bottom="0px">
<mj-column width="33.33333333333333%"></mj-column>
<mj-column width="33.33333333333333%">
<mj-image src="https://dmmedia.sphero.com/email-marketing/Star-Wars/sphero-logo-bottom-gray.png" href="https://www.sphero.com" width="134px" align="center"></mj-image>
</mj-column>
<mj-column width="33.33333333333333%">
<mj-text align="center" color="#ffffff" font-size="10px">&copy; & &trade; Lucasfilm Ltd.</mj-text>
</mj-column>
</mj-section>
</mj-body>
</mjml>`;
myCodeMirror.setValue(mjmlStarWars);

sdk.getContent(function (data) {
    data["mjml"] = mjmlStarWars;
    sdk.setContent(
    "507. Preview not available. Please click on render to generate HTML preview."
    );
});
sdk.getData(function (data) {
    data["mjml"] = mjmlStarWars;
    data["html"] = renderMjml();
    sdk.setData(data);
});
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

function getHelloWorldHTML() {
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
try { 
    var htmlOutput = mjml(helloWorldmjml);
    if(htmlOutput.html.length > 0) { 
    return htmlOutput.html
    }
}catch(e){
    consoleprint('Error: ' + e);
}
}

function validateMjmlInput(textAreaContent) {
    var htmlObject = document.createElement('div');
    htmlObject.innerHTML = textAreaContent;
    if( htmlObject.querySelector('mjml') == null && htmlObject.querySelector('mj-body') == null) {
        textAreaContent = `<mjml><mj-body>` + textAreaContent + `</mj-body></mjml>`
    }
    return textAreaContent;
}

function sanitiseHtml(htmlOutput) { 
    var htmlObject = document.createElement('div');
    htmlObject.innerHTML = htmlOutput;
    
    htmlObject.querySelectorAll('meta').forEach(function(e) { 
        htmlObject.removeChild(e) 
    });
    htmlObject.querySelectorAll('title').forEach(function(e) { 
        htmlObject.removeChild(e) 
    });
    
    htmlOutput = htmlObject.querySelector('div').innerHTML
    var config = { indent_size: 2, space_in_empty_paren: false, keep_array_indentation: true }
    htmlOutput = html_beautify(htmlOutput,config);
    console.log('formatted code ')
    console.log(htmlOutput)
    return htmlOutput;
}

function renderMjml () {
document.getElementById("errorMsg").innerHTML = "";
document.getElementById("alertBox").style.display = "none";

var textAreaContent = myCodeMirror.getValue();
textAreaContent = validateMjmlInput(textAreaContent);

var mjmlRenderedContent = "";

sdk.getData(function (data) {
    data["mjml"] = textAreaContent;
    sdk.setData(data);
    sdk.setContent(
    '<div style="font-size:12px;font-family:Arial">...</div>'
    ); 
});

try { 
    var htmlOutput = mjml(textAreaContent);
    if(htmlOutput.html.length > 0) {
        htmlOutput.html = sanitiseHtml(htmlOutput.html);
        //console.log(htmlOutput.html)
        sdk.getContent(function (content) {
            sdk.setContent(htmlOutput.html); 
        });

        sdk.getData(function (data) {
            data["mjml"] = textAreaContent;
            data["html"] = htmlOutput.html;
            sdk.setData(data);
        });

        if(htmlOutput.errors.length > 0){
            document.getElementById("errorMsg").innerHTML = "";
            document.getElementById("alertBox").style.display = "block";
            for(e in htmlOutput.errors) {
            document.getElementById("errorMsg").innerHTML += 'Line #' + htmlOutput.errors[e].line + ": [" + htmlOutput.errors[e].tagName + "] " + htmlOutput.errors[e].message + "<br>";
            }
        }
    } else {
        document.getElementById("errorMsg").innerHTML = "";
        document.getElementById("alertBox").style.display = "block";
        document.getElementById("errorMsg").innerHTML = "[ERROR]: Not a valid MJML document/ component.";
        for(e in htmlOutput.errors) {
            document.getElementById("errorMsg").innerHTML += 'Line #' + htmlOutput.errors[e].line + ": [" + htmlOutput.errors[e].tagName + "] " + htmlOutput.errors[e].message + "<br>";
        }
    }
}
catch(e) { 
    console.log(e);
    document.getElementById("errorMsg").innerHTML = "";
    document.getElementById("alertBox").style.display = "block";
    document.getElementById("errorMsg").innerHTML = "[ERROR]: Not a valid MJML document/ component.";
    
}
return true;
}

document.getElementById("editing").addEventListener(
"input",
debounce((e) => {
    console.log('debounced element ' + JSON.stringify(e));
    
    renderMjml();
}, 500)
);


function isEmptyObject(obj) {
for (var i in obj) return false;
return true;
}
function consoleprint(debug, msg) {
debug ? console.log(msg) : "";
}

var closebtns = document.getElementsByClassName("close");
var i;

for (i = 0; i < closebtns.length; i++) {
closebtns[i].addEventListener("click", function () {
    this.parentElement.parentElement.style.display = "none";
});
}