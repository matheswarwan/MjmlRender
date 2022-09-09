var textAreaContent,errMsg,i,elt=document.getElementById("editing"),myCodeMirror=CodeMirror.fromTextArea(elt,{lineNumbers:!0,lineWrapping:!0,mode:"xml",htmlMode:!0,lineSeparator:null,theme:"default",indentUnit:2,tabSize:4,indentWithTabs:!0,lineWrapping:!0,tabindex:1,autofocus:!0,gutter:!0,lineWrapping:!0,autoRefresh:!0});myCodeMirror.setSize("100%","100%"),myCodeMirror.on("change",renderMjml),myCodeMirror.refresh();var debug=!0;const debounce=(a,b)=>{let c;return function(...d){c&&clearTimeout(c),c=setTimeout(()=>{a(...d)},b)}};var sdk=new window.sfdc.BlockSDK({blockEditorWidth:500,tabs:["htmlblock",{name:"Code Snippets",key:"codeSnippets",url:"https://mjmlrender.pages.dev/CodeSnippets.html"},"stylingblock"]});function fnCallback(a){consoleprint(debug,a)}function mjmlHelloWorld(){var a=`<mjml>
<mj-body>
<mj-section>
<mj-column>
    <mj-divider border-color="#F45E43"></mj-divider>
    <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello World</mj-text>
</mj-column>
</mj-section>
</mj-body>
</mjml>`;myCodeMirror.setValue(a),sdk.getContent(function(b){b.mjml=a,sdk.setContent("Preview not available. Please click on render to generate HTML preview.")}),sdk.getData(function(b){b.mjml=a,b.html=renderMjml(),sdk.setData(b)})}function mjmlStarWarsTemplate(){var a=`<mjml>
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
</mjml>`;myCodeMirror.setValue(a),sdk.getContent(function(b){b.mjml=a,sdk.setContent("507. Preview not available. Please click on render to generate HTML preview.")}),sdk.getData(function(b){b.mjml=a,b.html=renderMjml(),sdk.setData(b)})}function getHelloWorldMJML(){return`<mjml>
<mj-body>
<mj-section>
<mj-column>
    <mj-divider border-color="#F45E43"></mj-divider>
    <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello World</mj-text>
</mj-column>
</mj-section>
</mj-body>
</mjml>`}function getHelloWorldHTML(){var b=`<mjml>
<mj-body>
<mj-section>
<mj-column>
    <mj-divider border-color="#F45E43"></mj-divider>
    <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello World</mj-text>
</mj-column>
</mj-section>
</mj-body>
</mjml>`;try{var a=mjml(b);if(a.html.length>0)return a.html}catch(c){consoleprint("Error: "+c)}}function renderMjml(){document.getElementById("errorMsg").innerHTML="",document.getElementById("alertBox").style.display="none";var b=myCodeMirror.getValue();sdk.getData(function(a){a.mjml=b,sdk.setData(a),sdk.setContent('<div style="font-size:12px;font-family:Arial">...</div>')});try{var a=mjml(b);if(a.html.length>0){if(sdk.getContent(function(b){sdk.setContent(a.html)}),sdk.getData(function(c){c.mjml=b,c.html=a.html,sdk.setData(c)}),a.errors.length>0)for(e in document.getElementById("errorMsg").innerHTML="",document.getElementById("alertBox").style.display="block",a.errors)document.getElementById("errorMsg").innerHTML+="Line #"+a.errors[e].line+": ["+a.errors[e].tagName+"] "+a.errors[e].message+"<br>"}else for(e in document.getElementById("errorMsg").innerHTML="",document.getElementById("alertBox").style.display="block",document.getElementById("errorMsg").innerHTML="[ERROR]: Not a valid MJML document/ component.",a.errors)document.getElementById("errorMsg").innerHTML+="Line #"+a.errors[e].line+": ["+a.errors[e].tagName+"] "+a.errors[e].message+"<br>"}catch(c){console.log(c),document.getElementById("errorMsg").innerHTML="",document.getElementById("alertBox").style.display="block",document.getElementById("errorMsg").innerHTML="[ERROR]: Not a valid MJML document/ component."}return!0}function isEmptyObject(a){for(var b in a)return!1;return!0}function consoleprint(a,b){a&&console.log(b)}document.getElementById("alertBox").style.display="none",document.getElementById("errorMsg").innerHTML="",sdk.setBlockEditorWidth(500,function(a){}),sdk.getContent(function(a){if(a)sdk.setContent(a,function(a){sdk.getData(function(a){a&a.mjml&&myCodeMirror.setValue(a.mjml)})});else{var c=getHelloWorldMJML(),b=getHelloWorldHTML();sdk.setContent(html_beautify(b)+"<!-- Beautified --> ",function(){myCodeMirror.setValue(c);var a={};a.mjml=c,a.html=b,sdk.setData(a)})}}),sdk.getData(function(a){!isEmptyObject(a)&&a.mjml&&myCodeMirror.setValue(a.mjml)}),sdk.getUserData(function(a){}),document.getElementById("renderBtn").addEventListener("click",function(){renderMjml()}),document.getElementById("editing").addEventListener("input",debounce(a=>{console.log("debounced element "+JSON.stringify(a)),renderMjml()},500));var closebtns=document.getElementsByClassName("close");for(i=0;i<closebtns.length;i++)closebtns[i].addEventListener("click",function(){this.parentElement.parentElement.style.display="none"})