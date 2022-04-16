var http = require('http');
var fs = require('fs');
var events = require('events');
var url = require('url');
/*var mjml2html = require('mjml')

exports.mjmlFunction = function(mjmlText) {
  return mjml2html(mjmlText, {})
}

var helloWorld = `<mjml>
<mj-body>
  <mj-section>
    <mj-column>
      <mj-divider border-color="#F45E43"></mj-divider>
      <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello World</mj-text>
    </mj-column>
  </mj-section>
</mj-body>
</mjml>`
var mjmlResponse = mjml2html(helloWorld, {});
console.log(mjmlResponse['html']);

//mjmlModule(x) */

//Create an event handler:
var myEventHandler = function () {
  console.log('I hear a scream!');
}


http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var filename = "." + (q.pathname != '/'?q.pathname:'/index.html');
  //console.log('path name - ' + q.pathname);
  console.log('file requested - ' + filename);
  fs.readFile(filename, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found. Try with /execute or /save");
    } 
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
}).listen(process.env.PORT || 8080);

console.log('listening on 8080 OR ' + process.env.PORT )