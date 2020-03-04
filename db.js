const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_ownership_db"
);

client.connect();

const sync = async () => {
  const SQL = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  DROP TABLE IF EXISTS user_things;
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS things;


  CREATE TABLE users(
    id UUID PRIMARY KEY default uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    CHECK (char_length(name)>0)
    );

  CREATE TABLE things(
      id UUID PRIMARY KEY default uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      CHECK (char_length(name)>0)
      );

  CREATE TABLE user_things(
        id UUID PRIMARY KEY default uuid_generate_v4(),
        "userId" UUID REFERENCES users(id),
        "thingId" UUID REFERENCES things(id)
        );

  CREATE UNIQUE INDEX ON user_things("userId", "thingId");
  `;

  await client.query(SQL);

  const [Terri, Chaise, work, drawing] = await Promise.all([
    createUser({ name: "Terri" }),
    createUser({ name: "Chaise" }),
    createThing({ name: "work" }),
    createThing({ name: "drawing" })
  ]);
  await Promise.all([
    createUserThing({ userId: Terri.id, thingId: drawing.id }),
    createUserThing({ userId: Chaise.id, thingId: work.id })
  ]);
};

//Additional methods here for reading, creating, destroying
const createUser = async ({ name }) => {
  return (
    await client.query("INSERT INTO users(name) VALUES ($1) returning * ", [name])
  ).rows[0];
};

const createThing = async ({ name }) => {
  return (
    await client.query("INSERT INTO things(name) VALUES ($1) returning *", [name])
  ).rows[0];
};

const createUserThing = async ({ userId, thingId }) => {
  return (
    await client.query('INSERT INTO user_things("userId", "thingId") VALUES ($1, $2) returning *',
      [userId, thingId])
  ).rows[0];
};

const readUsers = async () => {
  return (await client.query("SELECT * FROM users")).rows;
};

const readThings = async () => {
  return (await client.query("SELECT * FROM things")).rows;
};

const readUserThings = async () => {
  return (await client.query("SELECT * FROM user_things")).rows;
};

const deleteUser = async (id) => {
  const SQL = 'DELETE FROM users WHERE id = $1';
  await client.query(SQL, [id]);
};

const deleteThing = async (id) => {
  const SQL = 'DELETE FROM things WHERE id = $1';
  await client.query(SQL, [id]);
};

const deleteUserThing = async (id) => {
  const SQL = 'DELETE FROM user_things WHERE id = $1';
  await client.query(SQL, [id]);
};

module.exports = {
  sync,
  readUsers,
  createUser,
  createThing,
  createUserThing,
  readUserThings,
  readThings,
  deleteUser,
  deleteThing,
  deleteUserThing
};
