var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  var OpenTok = require('opentok');
  /* GET home page. */

  var apiKey = process.env.API_KEY;
  var apiSecret = process.env.API_SECRET;
  var sessionId;
  var token;

  opentok = new OpenTok(apiKey, apiSecret);
  if (!apiKey || !apiSecret) {
    throw "no apikey or apisecret";
  }
  opentok.createSession({mediaMode:"routed"}, function(error, session) {
    if (error) {
      throw error;
    } else {
      sessionId = session.sessionId;
      token = opentok.generateToken(sessionId);
    }
  });

  res.render('index.pug', {
    apiKey: apiKey,
    sessionId: sessionId,
    token: token,
    title: "bobby"
  });
});

module.exports = router;
