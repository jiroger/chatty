import client from './client.js';
client.connect()
    .then(() => console.log('connected'))
    .catch(err => console.error('connection error', err.stack));

export default {
    createTable() {
        client.query(`
        CREATE TABLE IF NOT EXISTS sessions (
            sessionId text,
            numConnected int
        );
        `).then(res => {
            console.log('Table is successfully created');
        })
        .catch(err => {
            console.error(err);
        })
    },
    
    dropTable() {
        client.query(`
        DROP TABLE IF EXISTS sessions;
        `).then(res => {
            console.log('Table is successfully dropped');
        })
        .catch(err => {
            console.error(err);
        })
    },
    /* finds the next open room
    for a FULL room, if user reloads, they will either be
    placed into a new room or join the oldest non-full room
    
    otherwise, for normal reload, user will be placed into the
    oldest non-full room
    */

    findOpenSession(size) {
        return client.query(`
        SELECT sessionId FROM sessions WHERE numConnected < ` + size + `
        LIMIT 1;
        `).then(res => {
            return res["rows"][0];
        })
        .catch(err => {
            console.error(err);
            return err;
        })
    },

    addSession(session) {
        client.query(`
        INSERT INTO sessions (sessionId, numConnected)
        VALUES ('` + session + `', 0);
        `).then(res => {
            console.log('Added sessionID successfully');
        })
        .catch(err => {
            console.error(err);
        })
    },

    addUser(session) {
        client.query(`
        UPDATE sessions
        SET numConnected = numConnected + 1
        WHERE sessionId = '` + session + `';`
        ).then(res => {
            console.log('Added user successfully');
        })
        .catch(err => {
            console.error(err);
        })
    },

    removeUser(session) {
        client.query(`
        UPDATE sessions
        SET numConnected = numConnected - 1
        WHERE sessionId = '` + session + `';`
        ).then(res => {
            console.log('Removed user successfully');
        })
        .catch(err => {
            console.error(err);
        })
    },
};