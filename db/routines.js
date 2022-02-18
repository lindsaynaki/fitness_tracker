const client  = require('./client')

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

// what does it mean without activities
const getRoutinesWithoutActivities = async () => {
    try {
        const {rows: routines } = await client.query(`
            SELECT * FROM routines
        `)
        return routines;
    } catch(error) {
        throw error
    }
};


// supposed to include activities 
const getAllRoutines = async () => {
    try {
        const {rows: routines} = await client.query(`
            SELECT * FROM routines
        `)
        return routines;
    } catch(error) {
        throw error
    }
}

const getAllPublicRoutines = async () => { 
    try {
        const { rows: publicRoutines } = await client.query(`
            SELECT * FROM routines
            WHERE "isPublic" = true;
        `)
        return publicRoutines; 
    } catch(error) {
        throw error
    }
}

const getAllRoutinesByUser = async ({username}) => {
    try {   
        const { rows: routines } = await client.query(`
            SELECT * FROM routines
            WHERE username=$1;
        `, [username])
        return routines;
    } catch(error) {
        throw error
    }
}

// not sure if this is correct 
const getPublicRoutinesByUser = async ({username}) => {
    try{
        const { rows: publicRoutines } = await client.query(`
            SELECT * FROM routines
            WHERE username = $1, "isPublic" = $2
        `, [username, isPublic])
     } catch(error) {
        throw error
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

const updateRoutine = async ({ id, isPublic, name, goal}) => {
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
            UPDATE routines
            SET "isPublic" = false
            WHERE id = $1;
        `, [id])
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