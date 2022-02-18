const client = require('./client')

const getRoutineActivityById = async (id) => {
    try{
        const { row: [ routine_activity ] } = client.query(`
        SELECT *
        FROM routine_activities
        WHERE id=$1
        `, [id])
        return routine_activity
        
    } catch(error) {
        throw error; 
    }
}

const addActivityToRoutine = async ({routineId, activityId, count, duration}) => {
    try {
        const { rows: [routine] } = await client.query(`
            INSERT INTO routine_activities ("routineId", "activityId", count, duration)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [routineId, activityId, count, duration])
        return routine;
    } catch(error) {
        throw error
    }
};

const updateRoutineActivity = async ({id, count, duration}) => {
    try {

    } catch(error) {
        throw error
    }
}

const destroyRoutineActivity = async (id) => {
    try {

    } catch(error) {
        throw error
    }
}

const getRoutineActivitiesByRoutine = async ({id}) => {
    try {

    } catch(error) {
        throw error
    }
};

module.exports = {
    getRoutineActivityById,
    addActivityToRoutine,
    updateRoutineActivity,
    destroyRoutineActivity,
    getRoutineActivitiesByRoutine
}