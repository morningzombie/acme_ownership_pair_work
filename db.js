const {Client}= require('pg');

const client = new Client('postgres://localhost/many_to_many_db');

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

module.exports = {
    sync
};;