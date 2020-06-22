import express from 'express';
import OpenTok from 'opentok';

const router = express.Router();
let sessionId;
let token;

router.get('/', (req, res) => {
  /* GET home page. */

  const apiSecret = process.env.API_SECRET;
  const apiKey = process.env.API_KEY;

  const opentok = OpenTok(apiKey, apiSecret);
  if (!apiKey || !apiSecret) {
    throw "no apikey or apisecret";
  }
  
  opentok.createSession({mediaMode:"routed"}, (error, session) => {
    if (error) {
      throw error;
    } 
    else {
      sessionId = session.sessionId;
      token = opentok.generateToken(sessionId);
    }
  });

  res.render('index.pug', {
    title: "bobby",
    apiKey: apiKey,
    token: token,
    sessionId: sessionId
  });
});

export default router;


