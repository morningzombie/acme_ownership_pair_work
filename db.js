const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_db');

client.connect();

const sync = async()=> {
  //create tables and seed some data
};

//Additional methods here for reading, creating, destroying


module.exports = {
  sync
};
