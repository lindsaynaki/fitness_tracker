const  client  = require('./client');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const createUser = async ({username, password}) => {
    const hashPwd = await bcrypt.hash(password, SALT_ROUNDS);
    try {
        const { rows: [user] } = await client.query(`
            INSERT INTO users (username, password)
            VALUES ($1, $2)
            RETURNING *; 
        `, [username, hashPwd]);
        return user;
    } catch(error) {
        throw error; 
    }
};

const getUser = async ({ username, password }) => {
    try{
        const {rows: [user] } = await client.query(`
        SELECT * FROM users
        WHERE username = $1
        `, [username])

        if (!user) {
            throw {
                name: "UserNotFound",
                message: "User not found with that username"
            }
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            delete user.password;
            return user
        }

    } catch(error){
        throw error;
    }
}

const getUserById = async (userId) => {
    try {
        const { rows: [user] } = await client.query(`
            SELECT * FROM users
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