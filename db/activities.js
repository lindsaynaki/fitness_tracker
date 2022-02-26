const client = require('./client')

const getActivityById = async (id) => {
    try {
        const { rows: [activity] } = await client.query(`
            SELECT * FROM activities
            WHERE id=$1;
        `, [id]);

        return activity;
    } catch (error) {
        throw error;
    }
};

const getAllActivities = async () => {
    try {
        const { rows: activities } = await client.query(`
            SELECT * FROM activities;
        `);

        return activities;
    } catch (error) {
        throw error
    }
};

const createActivity = async ({ name, description }) => {
    try {
        const { rows: [activity] } = await client.query(`
            INSERT INTO activities (name, description)
            VALUES ($1, $2)
            RETURNING *;
        `, [name, description]);

        return activity;
    } catch (error) {
        throw error
    }
};

const updateActivity = async ({ id, ...fields }) => {
    const setString = Object.keys(fields).map((key, index) => `"${key}" =  $${index + 1}`).join(', ');

    try {
        const { rows: [activity] } = await client.query(`
            UPDATE activities
            SET ${setString}
            WHERE id = ${id}
            RETURNING *;
        `, Object.values(fields));

        return activity;
    } catch (error) {
        throw error
    }
};

module.exports = {
    getActivityById,
    getAllActivities,
    createActivity,
    updateActivity
}