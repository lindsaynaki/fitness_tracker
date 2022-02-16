const { client } = require('./index')

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
        `)
        return routines;
    } catch(error) {
        throw error
    }
};

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

const getPublicRoutinesByUser = async({username}) => {
    try{
        const { rows: publicRoutines } = await client.query(`
            SELECT * FROM routines
            WHERE 
        `)
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
    getPublicRoutinesByUser
}