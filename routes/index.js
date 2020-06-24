import express from 'express';
import OpenTok from 'opentok';
import db from '../db/query.js';

const router = express.Router();
const apiSecret = process.env.API_SECRET;
const apiKey = process.env.API_KEY;
const opentok = OpenTok(apiKey, apiSecret);

let sessionId;
let token;

router.get('/', (req, res) => {
  /* GET home page. */

  if (!apiKey || !apiSecret) {
    console.log("no apikey/apisecret")
    process.exit(1);
  }

  //note to self: findOpenSession returns a promise
  db.findOpenSession().then(data => {
    console.log("sajdfhsalkhfd");
  })

  if (!sessionId) {
    opentok.createSession({mediaMode:"routed"}, (error, session) => {
      if (error) {
        console.log(error);
        process.exit(1);
      } 
      else {
        sessionId = session.sessionId;
        //db.addSession(sessionId);
      }
    });
  }

  token = opentok.generateToken(db.findOpenSession());

  res.render('index.pug', {
    title: "bobby",
    apiKey: apiKey,
    token: token,
    sessionId: sessionId
  });
});

export default router;


