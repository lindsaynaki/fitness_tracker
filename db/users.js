const { client } = require('./index');

const createUser = async ({username, password}) => {
    try {
        const { rows: [user] } = await client.query(`
            INSERT INTO users (username, password)
            VALUES ($1, $2)
            RETURNING *; 
        `, [username, password]);
        delete user.password
        return user;
    } catch(error) {
        throw error; 
    }
}

const getUser = async ({username, password}) => {
    try {
        const { rows: [user] } = await client.query(`
            SELECT * FROM users;
            WHERE 
        `)
        return user;
    } catch(error) {
        throw error;
    }
}

const getUserById = async (userId) => {
    try {
        const { rows: [user] } = await client.query(`
            SELECT * FROM USERS
            WHERE id=$1;
        `, [userId])
        return user;
    } catch(error) {
        throw error; 
    }
}

const getUserByUsername = async (username) => {
    try {
        const { rows: [user] } = await client.query(`
            SELECT * FROM users
            WHERE username=$1;
        `, [username]);
        return user;
    } catch(error) {
        throw error; 
    }
}

module.exports = {
    createUser,
    getUser,
    getUserById,
    getUserByUsername
}