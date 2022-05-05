mjmlTitle = [
  'mjml',
  'mj-body',
  'mj-include',
  'mj-attribute',
  'mj-accordian',
  'mj-button',
  'mj-image',
  'mj-social'
]

mjmlDescription = [
    `A MJML document starts with a <code>&lt;mjml&gt;</code> tag, it can contain only <code>&lt;mj-head&gt;</code> and <code>&lt;mj-body&gt;</code> tags. Both have the same purpose of head and body in a HTML document.`
    ,`This is the starting point of your email.`
    ,`The <code>mjml-core</code> package allows you to include external mjml files to build your email template.`
    ,`Inside <code>mj-attributes</code>, a tag citing one MJML component (like <code>mj-text</code>; see example) overrides default settings for listed MJML attributes on the one component.`
    ,`<code>mj-accordion</code> is an interactive MJML component to stack content in tabs, so the information is collapsed and only the titles are visible. Readers can interact by clicking on the tabs to reveal the content, providing a great experience on mobile devices where space is scarce.`
    ,`Displays a customizable button.<br> The <code>mj-button</code> won't be fully clickable because of client support. See discussion at <a href="https://github.com/mjmlio/mjml/issues/359" target="_blank">Issue #359</a>. `
    ,`Displays a responsive image in your email. It is similar to the HTML <code>&lt;img /&gt;</code> tag. Note that if no width is provided, the image will use the parent column width.`
    ,'Displays calls-to-action for various social networks with their associated logo. You can add social networks with the <code>mj-social-element</code> tag.'
]

mjmlText = 
[
`<mjml>
    <mj-body>
        <!-- Your email goes here -->
    </mj-body>
</mjml>`
, 
`<!-- header.mjml -->
<mj-section>
    <mj-column>
        <mj-text>This is a header</mj-text>
    </mj-column>
</mj-section>

<!-- main.mjml -->
<mjml>
  <mj-body>
    <mj-include path="./header.mjml" />
  </mj-body>
</mjml>

<!-- main.mjml -->
  <mj-include path="./styles.css" type="css" />
  <mj-include path="./inline-styles.css" type="css" css-inline="inline" />
  
<!-- main.mjml -->
  <mj-include path="./partial.html" type="html" />`
,
`<mjml>
    <mj-head>
        <mj-attributes>
        <mj-text padding="0" />
        <mj-class name="blue" color="blue" />
        <mj-class name="big" font-size="20px" />
        <mj-all font-family="Arial" />
        </mj-attributes>
    </mj-head>
    <mj-body>
        <mj-section>
        <mj-column>
            <mj-text mj-class="blue big">
            Hello World!
            </mj-text>
        </mj-column>
        </mj-section>
    </mj-body>
</mjml>`
,
`<mjml>
<mj-head>
  <mj-attributes>
    <mj-accordion border="none" padding="1px" />
    <mj-accordion-element icon-wrapped-url="https://i.imgur.com/Xvw0vjq.png" icon-unwrapped-url="https://i.imgur.com/KKHenWa.png" icon-height="24px" icon-width="24px" />
    <mj-accordion-title font-family="Roboto, Open Sans, Helvetica, Arial, sans-serif" background-color="#fff" color="#031017" padding="15px" font-size="18px" />
    <mj-accordion-text font-family="Open Sans, Helvetica, Arial, sans-serif" background-color="#fafafa" padding="15px" color="#505050" font-size="14px" />
  </mj-attributes>
</mj-head>

<mj-body>
  <mj-section padding="20px" background-color="#ffffff">
    <mj-column background-color="#dededd">
      <mj-accordion>
        <mj-accordion-element>
          <mj-accordion-title>Why use an accordion?</mj-accordion-title>
          <mj-accordion-text>
            <span style="line-height:20px">
              Because emails with a lot of content are most of the time a very bad experience on mobile, mj-accordion comes handy when you want to deliver a lot of information in a concise way.
            </span>
          </mj-accordion-text>
        </mj-accordion-element>
        <mj-accordion-element>
          <mj-accordion-title>How it works</mj-accordion-title>
          <mj-accordion-text>
            <span style="line-height:20px">
              Content is stacked into tabs and users can expand them at will. If responsive styles are not supported (mostly on desktop clients), tabs are then expanded and your content is readable at once.
            </span>
          </mj-accordion-text>
        </mj-accordion-element>
      </mj-accordion>
    </mj-column>
  </mj-section>
</mj-body>
</mjml>`
,
`<mjml>
<mj-body>
  <mj-section>
    <mj-column>
      <mj-button font-family="Helvetica" background-color="#f45e43" color="white">
        Don't click me!
       </mj-button>
    </mj-column>
  </mj-section>
</mj-body>
</mjml>`
,`<mjml>
<mj-body>
  <mj-section>
    <mj-column>
      <mj-carousel>
        <mj-carousel-image src="https://www.mailjet.com/wp-content/uploads/2016/11/ecommerce-guide.jpg" />
        <mj-carousel-image src="https://www.mailjet.com/wp-content/uploads/2016/09/3@1x.png" />
        <mj-carousel-image src="https://www.mailjet.com/wp-content/uploads/2016/09/1@1x.png" />
      </mj-carousel>
    </mj-column>
  </mj-section>
</mj-body>
</mjml>`
,`<mjml>
<mj-body>
  <mj-section>
    <mj-column>
      <!-- Your first column -->
    </mj-column>
    <mj-column>
      <!-- Your second column -->
    </mj-column>
  </mj-section>
</mj-body>
</mjml>`
,`<mjml>
<mj-body>
  <mj-section>
    <mj-column>
      <mj-divider border-width="1px" border-style="dashed" border-color="lightgrey" />
    </mj-column>
  </mj-section>
</mj-body>
</mjml>`
,`<mjml>
<mj-body>
  <mj-section>
    <mj-group>
      <mj-column>
        <mj-image width="137px" height="185px" padding="0"    src="https://mjml.io/assets/img/easy-and-quick.png" />
        <mj-text align="center">
          <h2>Easy and quick</h2>
          <p>Write less code, save time and code more efficiently with MJML’s semantic syntax.</p>
        </mj-text>
      </mj-column>
      <mj-column>
        <mj-image width="166px" height="185px" padding="0" src="https://mjml.io/assets/img/responsive.png" />
        <mj-text align="center">
          <h2>Responsive</h2>
          <p>MJML is responsive by design on most-popular email clients, even Outlook.</p>
        </mj-text>
      </mj-column>
    </mj-group>
  </mj-section>
</mj-body>
</mjml>`
,`<mjml>
<mj-body>
  <mj-hero
    mode="fixed-height"
    height="469px"
    background-width="600px"
    background-height="469px"
    background-url=
        "https://cloud.githubusercontent.com/assets/1830348/15354890/1442159a-1cf0-11e6-92b1-b861dadf1750.jpg"
    background-color="#2a3448"
    padding="100px 0px">
    <mj-text
      padding="20px"
      color="#ffffff"
      font-family="Helvetica"
      align="center"
      font-size="45px"
      line-height="45px"
      font-weight="900">
      GO TO SPACE
    </mj-text>
    <mj-button href="https://mjml.io/" align="center">
      ORDER YOUR TICKET NOW
    </mj-button>
  </mj-hero>
</mj-body>
</mjml>`
,`<mjml>
<mj-body>
  <mj-section>
    <mj-column>
      <mj-image width="300px" src="https://www.online-image-editor.com//styles/2014/images/example_image.png" />
    </mj-column>
  </mj-section>
</mj-body>
</mjml>`
,`<mjml>
<mj-body>
  <mj-section background-color="#ef6451">
    <mj-column>
      <mj-navbar base-url="https://mjml.io" hamburger="hamburger" ico-color="#ffffff">
          <mj-navbar-link href="/gettings-started-onboard" color="#ffffff">Getting started</mj-navbar-link>
          <mj-navbar-link href="/try-it-live" color="#ffffff">Try it live</mj-navbar-link>
          <mj-navbar-link href="/templates" color="#ffffff">Templates</mj-navbar-link>
          <mj-navbar-link href="/components" color="#ffffff">Components</mj-navbar-link>
      </mj-navbar>
    </mj-column>
  </mj-section>
</mj-body>
</mjml>`
,`<mjml>
<mj-body>
  <mj-raw>
    <!-- Your content goes here -->
  </mj-raw>
</mj-body>
</mjml>

<mjml>
  <mj-body>
    <mj-raw>
      <!-- htmlmin:ignore -->{% if foo < 5 %}<!-- htmlmin:ignore -->
    </mj-raw>
      <!-- Some mjml section -->
    <mj-raw>
      {% endif %}
    </mj-raw>
  </mj-body>
</mjml>

<mjml>
  <mj-raw position="file-start">This will be added at the beginning of the file</mj-raw>
  <mj-body>
    <!-- Your content goes here -->
  </mj-body>
</mjml>`
,`<mjml>
<mj-body>
  <mj-section full-width="full-width" background-color="red">
    <!-- Your columns go here -->
  </mj-section>
</mj-body>
</mjml>`
,
`<mjml>
<mj-body>
  <mj-section>
    <mj-column>
      <mj-social font-size="15px" icon-size="30px" mode="horizontal">
        <mj-social-element name="facebook" href="https://mjml.io/">
          Facebook
        </mj-social-element>
        <mj-social-element name="google" href="https://mjml.io/">
          Google
        </mj-social-element>
        <mj-social-element  name="twitter" href="https://mjml.io/">
          Twitter
        </mj-social-element>
      </mj-social>
    </mj-column>
  </mj-section>
</mj-body>
</mjml>`
,`<mjml>
<mj-body>
  <mj-section>
    <mj-column>
      <mj-text>A first line of text</mj-text>
      <mj-spacer height="50px" />
      <mj-text>A second line of text</mj-text>
    </mj-column>
  </mj-section>
</mj-body>
</mjml>`
,`<mjml>
<mj-body>
  <mj-section>
    <mj-column>
      <mj-table>
        <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
          <th style="padding: 0 15px 0 0;">Year</th>
          <th style="padding: 0 15px;">Language</th>
          <th style="padding: 0 0 0 15px;">Inspired from</th>
        </tr>
        <tr>
          <td style="padding: 0 15px 0 0;">1995</td>
          <td style="padding: 0 15px;">PHP</td>
          <td style="padding: 0 0 0 15px;">C, Shell Unix</td>
        </tr>
        <tr>
          <td style="padding: 0 15px 0 0;">1995</td>
          <td style="padding: 0 15px;">JavaScript</td>
          <td style="padding: 0 0 0 15px;">Scheme, Self</td>
        </tr>
      </mj-table>
    </mj-column>
  </mj-section>
</mj-body>
</mjml>`,
`<mjml>
<mj-body>
  <mj-section>
    <mj-column>
      <mj-text>
        <h1>
          Hey Title!
        </h1>
      </mj-text>
    </mj-column>
  </mj-section>
</mj-body>
</mjml>`,
`<mjml>
<mj-body>
  <mj-wrapper border="1px solid #000000" padding="50px 30px">
    <mj-section border-top="1px solid #aaaaaa" border-left="1px solid #aaaaaa" border-right="1px solid #aaaaaa" padding="20px">
      <mj-column>
        <mj-image padding="0" src="https://placeholdit.imgix.net/~text?&w=350&h=150" />
      </mj-column>
    </mj-section>
    <mj-section border-left="1px solid #aaaaaa" border-right="1px solid #aaaaaa" padding="20px" border-bottom="1px solid #aaaaaa">
      <mj-column border="1px solid #dddddd">
        <mj-text padding="20px"> First line of text </mj-text>
        <mj-divider border-width="1px" border-style="dashed" border-color="lightgrey" padding="0 20px" />
        <mj-text padding="20px"> Second line of text </mj-text>
      </mj-column>
    </mj-section>
  </mj-wrapper>
</mj-body>
</mjml>`
];