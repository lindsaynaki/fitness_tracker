const { client } = require('./index')

const getActivityById = async (id) => {
    try {
        const {rows: [activity]} = await client.query(`
            SELECT * FROM activites
            WHERE id = $1
        `, [id])
        return activity; 
    } catch(error) {
        throw error;
    }
};

const getAllActivities = async () => {
    try {
        const {rows: activities} = await client.query(`
            SELECT * FROM activities
        `)
        return activities; 
    } catch(error) {
        throw error
    }
};

const createActivity = async ({name, description}) => {
    try {
        const {rows: [activity]} = await client.query(`
            INSERT INTO activites (name, description)
            VALUES $1, $2
            RETURNING *;
        `, [name, description])
        return activity;
    } catch(error) {
        throw error
    }
};

const updateActivity = async (id, name, description) => {
    try {   
        const {rows: [activity]} = await client.query(`
            UPDATE activities
            SET name=${name}, description=${description}
            WHERE id=$1
        `, [id])
        return activity
    } catch(error) {
        throw error
    }
};

module.exports = {
    getActivityById,
    getAllActivities,
    createActivity,
    updateActivity
}