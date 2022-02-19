const client = require('./client')
const util = require('util')

const getRoutineById = async (id) => {
    try {
        const { rows: [routine] } = await client.query(`
            SELECT * FROM routines 
            WHERE id=$1;
        `, [id])
        return routine;
    } catch(error) {
        throw error
    }
};

const getRoutinesWithoutActivities = async () => {
    try {
        const {rows: routines } = await client.query(`
            SELECT * FROM routines
            WHERE id NOT IN (SELECT "routineId" FROM routine_activities)
        `)
        return routines;
    } catch(error) {
        throw error
    }
};

// supposed to include activities 
// selects and returns an array of all routines, includes their activities 
// includes username, from users join, aliased as creatorName 
// includes duration and count on activities, from routine_activities join
const getAllRoutines = async () => {
    try {
        const {rows: routines} = await client.query(`
            SELECT routines.*, users.username AS "creatorName" FROM routines 
            JOIN users ON users.id=routines."creatorId"
        `)
        const { rows: activities } = await client.query(`
            SELECT activities.*, routine_activities."routineId", routine_activities.duration, routine_activities.count FROM activities
            JOIN routine_activities ON activities.id = routine_activities."activityId";
        `)

        routines.forEach((routine) => {
            routine.activities = activities.filter(activity => 
                routine.id === activity.routineId);
        })
        
        console.log('routines: ', util.inspect(routines, false, 5, true))
        return routines;
    } catch(error) {
        throw error
    }
}

const getAllPublicRoutines = async () => { 
    try {
        const { rows: routines } = await client.query(`
            SELECT routines.*, users.username AS "creatorName" FROM routines 
            JOIN users ON users.id=routines."creatorId"
            WHERE "isPublic" = true
        `)
        const { rows: activities } = await client.query(`
            SELECT * FROM activities
            JOIN routine_activities ON activities.id = routine_activities."activityId"
        `)
        routines.forEach((routine) => {
            routine.activities = activities.filter(activity => 
                routine.id === activity.routineId);
        })
        console.log('public routines: ', routines)
        return routines; 
    } catch(error) {
        throw error
    }
}

const getAllRoutinesByUser = async ({username}) => {
    try {   
        const { rows: routines } = await client.query(`
            SELECT routines.*, users.username AS "creatorName" FROM routines 
            JOIN users ON users.id=routines."creatorId"
            WHERE users.username = $1;
        `, [username])
        const { rows: activities } = await client.query(`
            SELECT * FROM activities
            JOIN routine_activities ON activities.id = routine_activities."activityId"
        `)
        routines.forEach((routine) => {
            routine.activities = activities.filter(activity => 
                routine.id === activity.routineId);
        })

        return routines; 
    } catch(error) {
        throw error
    }
}

const getPublicRoutinesByUser = async ({username}) => {
    try {
        const { rows: routines } = await client.query(`
            SELECT routines.*, users.username AS "creatorName" FROM routines 
            JOIN users ON users.id=routines."creatorId"
            WHERE "isPublic" = true AND users.username = $1;
        `, [username])
        const { rows: activities } = await client.query(`
            SELECT * FROM activities
            JOIN routine_activities ON activities.id = routine_activities."activityId"
        `)
        routines.forEach((routine) => {
        routine.activities = activities.filter(activity => 
            routine.id === activity.routineId);
    })
        return routines;
    } catch(error) {
        throw error;
    } 
}

// what you mean by activity
const getPublicRoutinesbyActivity = async ({id}) => {
    try {

    } catch(error){
        throw error
    }
}

const createRoutine = async({ creatorId, isPublic, name, goal}) => {
    try{
        const { rows: [routine] } = await client.query(`
            INSERT INTO routines ("creatorId", "isPublic", name, goal)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [creatorId, isPublic, name, goal])
        return routine; 
    } catch(error) {
        throw error
    }
}

const updateRoutine = async ({ id, ...routineFields}) => {

    try {
        const { rows: [routine] } = await client.query(`
            UPDATE routines 
            SET "isPublic" = $1, name = $2, goal = $3
            WHERE id=$4
            RETURNING *;
        `, [isPublic, name, goal, id])
        return routine; 
    } catch(error) {
        throw error
    }
}

// make sure to delete all the routine_activities whose routine is the one being deleted
const destroyRoutine = async (id) => {
    try {        
        await client.query(`
            DELETE FROM routine_activities
            WHERE "routineId"=$1
        `, [id]) 
        
        await client.query(`
            DELETE FROM routines
            WHERE id = $1;
        `, [id]);


    } catch(error) {
        throw error
    }
}

module.exports = {
    getRoutineById,
    getRoutinesWithoutActivities,
    getAllPublicRoutines,
    getAllRoutines,
    getAllRoutinesByUser, 
    getPublicRoutinesByUser,
    getPublicRoutinesbyActivity,
    createRoutine,
    updateRoutine,
    destroyRoutine
}