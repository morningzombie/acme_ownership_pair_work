<<<<<<< HEAD
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
=======
const {Client}= require('pg');
>>>>>>> 34304899d9eba7fb2b6d8bdaa49cfe1e798d5cdd

const client = new Client('postgres://localhost/many_to_many_db');

<<<<<<< HEAD
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
=======
client.connect();

const sync = async() => {
const SQL =`
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS user_departments;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS departments;

CREATE TABLE users(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    CHECK (char_length(name)>0)
);
CREATE TABLE departments(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    CHECK (char_length(name)>0)
);
CREATE TABLE user_departments(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "departmentId" UUID REFERENCES departments(id),
    "userId" UUID REFERENCES users(id)
);
CREATE UNIQUE INDEX ON user_departments("departmentId", "userId");
`;
await client.query(SQL);
const [moe, larry, engineering, hr]= await Promise.all([
    createUser({name: 'Moe'}),
    createUser({name: 'Larry'}),
    createDepartment({name:'Engineering'}),
    createDepartment({name:'HR'})
]);

await Promise.all([
    createUserDepartment({userId:larry.id, departmentId: engineering.id}),
    createUserDepartment({userId:larry.id, departmentId: hr.id}),

    createUserDepartment({userId:moe.id, departmentId: hr.id})

]);
>>>>>>> 34304899d9eba7fb2b6d8bdaa49cfe1e798d5cdd
};
const createUser = async({name}) => {
    return (
        await client.query('INSERT INTO users(name) VALUES ($1) returning *', [name])
        ).rows[0];
};

const createDepartment = async({name}) => {
    return (
        await client.query('INSERT INTO departments(name) VALUES ($1) returning *', [name])
        ).rows[0];
};

const createUserDepartment = async({userId, departmentId}) => {
    return (
        await client.query('INSERT INTO user_departments("userId", "departmentId") VALUES ($1, $2) returning *', [userId, departmentId])
        ).rows[0];
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
<<<<<<< HEAD
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
=======
    sync
};;
>>>>>>> 34304899d9eba7fb2b6d8bdaa49cfe1e798d5cdd
