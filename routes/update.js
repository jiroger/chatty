import express from 'express';
import db from '../db/query.js';
const router = express.Router();

router.post('/', (req, res) => {
    //if session monitoring doesn't work
    if (!req.body) {
        res.render('error');
        res.status(400).end()
    }
    else if (req.body.event === 'streamDestroyed') {
        db.removeUser(req.body.sessionId);
    }
    else if (req.body.event === 'streamCreated') {
        db.addUser(req.body.sessionId);
    }
    //204 status code = server accepted, no response
    res.status(204).end();
});

export default router;