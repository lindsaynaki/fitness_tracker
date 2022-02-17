const { client } = require('./client')

const getRoutineActivityById = async (id) => {
    try{

    } catch(error) {
        throw error; 
    }
}

const addActivityToRoutine = async ({routineId, activityId, count, duration}) => {
    try {

    } catch(error) {
        throw error
    }
}

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