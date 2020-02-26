const db = require('./db');

db.sync()
.then(()=>console.log('synced'));