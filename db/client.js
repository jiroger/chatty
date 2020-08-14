//imports for pg client
import pg from 'pg';
const { Client } = pg;
const client = new Client({
    connectionString: process.env.DATABASE_URL
});

export default client