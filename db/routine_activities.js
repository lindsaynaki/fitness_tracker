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

const updateRoutineActivity = async ({id, ...routineFields}) => {
    const setString = Object.keys(routineFields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
    if (setString.length === 0) {
        return;
    }
try {
    const { rows: [routine_activities] } = await client.query(`
    UPDATE routine_activities
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `, Object.values(routineFields));

    return routine_activities

} catch(error) {
    throw error
}
}

const destroyRoutineActivity = async ({id}) => {
try {
    await client.query(`
    DELETE FROM routine_activities
    WHERE id=$1;
    `, [ id ])
} catch(error) {
    throw error
}
}

const getRoutineActivitiesByRoutine = async ({id}) => {
    try {
        const { rows: routine_activity } = await client.query(`
        SELECT *
        FROM routine_activities
        `, [id])
        return routine_activity

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