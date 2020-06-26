import express from 'express';
import OpenTok from 'opentok';
import db from '../db/query.js';

const router = express.Router();
const apiSecret = process.env.API_SECRET;
const apiKey = process.env.API_KEY;
const opentok = OpenTok(apiKey, apiSecret);
const ROOM_SIZE = 4;

let sessionId;
let token;

router.get('/', (req, res) => {
  //only called after sessionId has been initalized
  function finish() {
    token = opentok.generateToken(sessionId);
    res.render('index.pug', {
      title: "bobby",
      apiKey: apiKey,
      token: token,
      sessionId: sessionId
    });
  }

  if (!apiKey || !apiSecret) {
    console.log("no apikey/apisecret")
    process.exit(1);
  }

  //findOpenSession returns a promise
  db.findOpenSession(ROOM_SIZE).then(data => {
    if (!data) { //create a new session if there's no available rooms
      opentok.createSession({mediaMode:"routed"}, (error, session) => {
        if (error) {
          console.log(error);
          res.locals.error = err;
          res.render('error');
        } 
        else {
          sessionId = session.sessionId;
          db.addSession(sessionId); //adds new room to db so others can join
          finish();
        } 
      });
    }
    else { //otherwise, use the next available room
      sessionId = data["sessionid"];
      finish()
    }
  });
});

export default router;


