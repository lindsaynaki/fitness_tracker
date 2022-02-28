const client = require('./client')

const getRoutineById = async (id) => {
    try {
        const { rows: [routine] } = await client.query(`
            SELECT * FROM routines 
            WHERE id=$1;
        `, [id]);

        return routine;
    } catch (error) {
        throw error
    }
};

const getRoutinesWithoutActivities = async () => {
    try {
        const { rows: routines } = await client.query(`
            SELECT * FROM routines
            WHERE id NOT IN (SELECT "routineId" FROM routine_activities);
        `)

        return routines;
    } catch (error) {
        throw error
    }
};

const addActivitiesToRoutines = async (routines) => {
    try {
        const routineIdArray = routines.map((routine) => {
            return routine.id
        })
        const { rows: activities } = await client.query(`
		 	SELECT activities.*, routine_activities.count, routine_activities.duration, routine_activities."routineId", routine_activities.id AS "routineActivityId"
			FROM activities
			JOIN routine_activities
			ON activities.id = routine_activities."activityId"
			WHERE routine_activities."routineId" IN (${routineIdArray});
		`)
        routines.forEach((routine) => {
            routine.activities = activities.filter((activity) => {
                return activity.routineId === routine.id
            })
        });

        return routines;
    } catch (error) {
        throw error;
    }
};

const getAllRoutines = async () => {
    try {
        const { rows: routines } = await client.query(`
            SELECT routines.*, users.username AS "creatorName" FROM routines 
            JOIN users ON users.id=routines."creatorId";
        `);

        return await addActivitiesToRoutines(routines);
    } catch (error) {
        throw error;
    }
};

const getAllPublicRoutines = async () => {
    try {
        const { rows: routines } = await client.query(`
            SELECT routines.*, users.username AS "creatorName" FROM routines 
            JOIN users ON users.id=routines."creatorId"
            WHERE "isPublic" = true;
        `);

        return await addActivitiesToRoutines(routines);
    } catch (error) {
        throw error;
    }
};

const getAllRoutinesByUser = async ({ username }) => {
    try {
        const { rows: routines } = await client.query(`
            SELECT routines.*, users.username AS "creatorName" FROM routines 
            JOIN users ON users.id=routines."creatorId"
            WHERE users.username = $1;
        `, [username]);

        return await addActivitiesToRoutines(routines);
    } catch (error) {
        throw error;
    }
};

const getPublicRoutinesByUser = async ({ username }) => {
    try {
        const { rows: routines } = await client.query(`
            SELECT routines.*, users.username AS "creatorName" FROM routines 
            JOIN users ON users.id=routines."creatorId"
            WHERE "isPublic" = true AND users.username = $1;
        `, [username]);

        return await addActivitiesToRoutines(routines);
    } catch (error) {
        throw error;
    }
};

const getPublicRoutinesByActivity = async ({ id }) => {
    try {
        const { rows: routines } = await client.query(`
            SELECT routines.*, users.username AS "creatorName" FROM routines 
            JOIN users ON users.id=routines."creatorId"
            WHERE "isPublic" = true;
        `);

        return await addActivitiesToRoutines(routines);
    } catch (error) {
        throw error;
    }
};

const createRoutine = async ({ creatorId, isPublic, name, goal }) => {
    try {
        const { rows: [routine] } = await client.query(`
            INSERT INTO routines ("creatorId", "isPublic", name, goal)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [creatorId, isPublic, name, goal]);

        return routine;
    } catch (error) {
        throw error;
    }
};

const updateRoutine = async ({ id, ...routineFields }) => {
    const setString = Object.keys(routineFields).map((key, index) =>
        `"${key}" = $${index + 1}`).join(', ')

    if (setString.length === 0) {
        return;
    }

    try {
        const { rows: [routine] } = await client.query(`
            UPDATE routines 
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
        `, Object.values(routineFields));

        return routine;
    } catch (error) {
        throw error
    }
};

const destroyRoutine = async (id) => {
    try {
        await client.query(`
            DELETE FROM routine_activities
            WHERE "routineId"=$1
        `, [id]);

        const { rows: [routine] } = await client.query(`
            DELETE FROM routines
            WHERE id = $1
            RETURNING *;
        `, [id]);

        return routine;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getRoutineById,
    getRoutinesWithoutActivities,
    getAllPublicRoutines,
    getAllRoutines,
    getAllRoutinesByUser,
    getPublicRoutinesByUser,
    getPublicRoutinesByActivity,
    createRoutine,
    updateRoutine,
    destroyRoutine
}