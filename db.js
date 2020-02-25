const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_db"
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
    name VARCHAR(255) UNIQUE NOT NULL  
    );
  
  CREATE TABLE things(
      id UUID PRIMARY KEY default uuid_generate_v4(),
      name VARCHAR(255) UNIQUE NOT NULL  
      );

  CREATE TABLE user_things(
        id UUID PRIMARY KEY default uuid_generate_v4(),
        "userId" UUID REFERENCES users(id),
        "thingsId" UUID REFERENCES things(id)
        );
`;

  const [Terri, Chaise, work, drawing] = await Promise.all([
    createUser({ name: "Terri" }),
    createUser({ name: "Chaise" }),
    createThing({ name: "work" }),
    createThing({ name: "drawing" })
  ]);
  await Promise.all([
    createUserThings({ userId: Terri.id, thingsId: drawing.id }),
    createUserThings({ userId: Chaise.id, thingsId: work.id })
  ]);
};

//Additional methods here for reading, creating, destroying
const createUser = async ({ name }) => {
  return (
    await client.query("INSERT INTO users(name) VALUES ($1) returning *", [
      name
    ])
  ).rows[0];
};

module.exports = {
  sync
};
