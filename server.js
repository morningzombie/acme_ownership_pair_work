const express = require('express');
const app = express();
const path = require('path');
const db = require('./db');


app.get('/', (req, res, next)=> {
  res.sendFile(path.join(__dirname, 'index.html'));
});

//Additional routes here
//GET, POST, DELETE for /api/users
//GET, POST, DELETE for /api/things
//GET, POST, DELETE for /api/user_things


app.use((req, res, next)=> {
  next({
    status: 404,
    message: `Page not found for ${req.method} ${req.url}`
  })
});

app.use((err, req, res, next)=> {
  res.status(err.status || 500).send({
    message: err.message || JSON.stringify(err)
  });
});



const port = process.env.PORT || 3000;

db.sync()
  .then(()=> {
    app.listen(port, ()=> {
      console.log(`listening on port ${port}`)
    });
  });
