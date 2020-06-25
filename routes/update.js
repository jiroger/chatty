import express from 'express';
import db from '../db/query.js';
const router = express.Router();

router.post('/', (req, res) => {
    if (req.body.event === 'connectionDestroyed') {
        db.removeUser(req.body.sessionId);
        console.log("meeeep");
    }
    else if (req.body.event === 'streamCreated') {
        console.log(req.body.event);
        db.addUser(req.body.sessionId);
        console.log("mooop");
    }
    //204 status code = server accepted, no response
    res.status(204).end();
});

export default router;