var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function (req, res) {
  var sessionId = res.locals.sessionId;
  var apiKey = res.locals.apiKey;
  var token = opentok.generateToken(sessionId);

  res.render('index.pug', {
    apiKey: apiKey,
    sessionId: sessionId,
    token: token
  });
});

module.exports = router;
