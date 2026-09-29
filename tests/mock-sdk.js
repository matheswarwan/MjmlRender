// Stand-in for the Content Builder Block SDK. Records every call in
// window.__block and keeps content and data in sessionStorage, so a reload
// behaves like reopening the block.
(function () {
  var saved = JSON.parse(sessionStorage.getItem('__block') || 'null') || { content: '', data: {} };
  window.__block = { content: saved.content, data: saved.data, calls: [] };
  function later(cb, v) { if (cb) setTimeout(function () { cb(v); }, 5); }
  function persist() { sessionStorage.setItem('__block', JSON.stringify({ content: __block.content, data: __block.data })); }
  function SDK() { __block.calls.push(['new', arguments[0]]); }
  SDK.prototype.getContent = function (cb) { __block.calls.push(['getContent']); later(cb, __block.content); };
  SDK.prototype.setContent = function (c, cb) { __block.calls.push(['setContent', String(c).length]); __block.content = c; persist(); later(cb, c); };
  SDK.prototype.getData = function (cb) { __block.calls.push(['getData']); later(cb, JSON.parse(JSON.stringify(__block.data))); };
  SDK.prototype.setData = function (d, cb) { __block.calls.push(['setData', Object.keys(d || {})]); __block.data = JSON.parse(JSON.stringify(d)); persist(); later(cb, d); };
  SDK.prototype.setSuperContent = function (c, cb) { __block.calls.push(['setSuperContent']); later(cb, c); };
  SDK.prototype.setBlockEditorWidth = function (w, cb) { later(cb, w); };
  SDK.prototype.getUserData = function (cb) { later(cb, {}); };
  window.sfdc = { BlockSDK: SDK };
})();
