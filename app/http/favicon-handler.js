const favicon = require('serve-favicon');

module.exports = function(req, res) {
  let dir = path.join(__dirname);
  dir = dir.substring(0, dir.lastIndexOf('/'))
  const faviconPath = path.join(dir, 'assets/favicon.ico')
  try {
    const _favicon = favicon(faviconPath);
    _favicon(req, res, (err) =>{
      console.log(`error serving favicon: ${JSON.stringify(err)}`);
      res.end();
    });
  } catch(err) {
    console.log(`error serving favicon: ${JSON.stringify(err)}`);
    res.end()
  }
}