<<<<<<< HEAD
const express = require("express");
const app = express();
const path = require("path");
const db = require("./db");
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

//Additional routes here
//GET, POST, DELETE for /api/users
//GET, POST, DELETE for /api/things
//GET, POST, DELETE for /api/user_things

app.get("/api/users", (req, res, next) => {
  db.readUsers()
    .then(users => {
      console.log("USERS", users);
      res.send(users);
    })
    .catch(next);
});

app.get("/api/things", (req, res, next) => {
  db.readThings()
    .then(things => {
      console.log("THINGS", things);
      res.send(things);
    })
    .catch(next);
});

app.get("/api/user_things", (req, res, next) => {
  db.readUserThings()
    .then(user_things => {
      console.log("USER-THINGS", user_things);
      res.send(user_things);
    })
    .catch(next);
});

app.post("/api/users", (req, res, next) => {
  db.createUser(req.body)
    .then(user => 
      res.send(user))
    .catch(next);
});

app.post("/api/things", (req, res, next) => {
  db.createThing(req.body)
    .then(thing => {
      res.send(thing);
    })
    .catch(next);
});

//ERROR: new row for relation "things" violates check constraint "things_name_check"

app.post("/api/user_things", (req, res, next) => {
  console.log("user_things", req.body);
  db.createUserThing(req.body)
    .then(user_thing => res.send(user_thing))
    .catch(next);
});

app.delete('/api/users/:id', (req, res, next) => {
  db.deleteUser(req.params.id)
      .then(() => res.sendStatus(204))
      .catch(next);
});

app.delete('/api/things/:id', (req, res, next) => {
  db.deleteThing(req.params.id)
      .then(() => res.sendStatus(204))
      .catch(next);
});

app.delete('/api/user_things/:id', (req, res, next) => {
  db.deleteUserThing(req.params.id)
      .then(() => res.sendStatus(204))
      .catch(next);
});

app.use((req, res, next) => {
  next({
    status: 404,
    message: `Page not found for ${req.method} ${req.url}`
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    message: err.message || JSON.stringify(err)
  });
});

const port = process.env.PORT || 3000;
=======
const db = require('./db');
>>>>>>> 34304899d9eba7fb2b6d8bdaa49cfe1e798d5cdd

db.sync()
.then(()=>console.log('synced'));