// /api/routines
const express = require('express');
const routinesRouter = express.Router();
const { addActivityToRoutine, getAllPublicRoutines, createRoutine, updateRoutine, destroyRoutine, getRoutineById } = require('../db');
const { requireUser } = require('./util');

// GET /api/routines
routinesRouter.get('/', async (req, res, next) => {
    try {
        const routines = await getAllPublicRoutines();
        res.send(routines);
    } catch (error) {
        next(error);
    }
});

// POST /routines
routinesRouter.post('/', requireUser, async (req, res, next) => {
    const { id } = req.user;
    const { creatorId, isPublic, name, goal } = req.body;

    try {
        const newRoutine = await createRoutine({ creatorId: id, isPublic, name, goal });
        res.send(newRoutine);
    } catch (error) {
        next(error);
    }
});

// PATCH /routines/:routineId 
routinesRouter.patch('/:routineId', requireUser, async (req, res, next) => {
    const { routineId } = req.params;
    const { id, isPublic, name, goal } = req.body;
    try {
        const updatedRoutine = await updateRoutine({ id: routineId, isPublic, name, goal });
        res.send(updatedRoutine);
    } catch (error) {
        next(error)
    }
});

// DELETE /routines/:routineId
routinesRouter.delete('/:routineId', requireUser, async (req, res, next) => {
    const id = req.params.routineId;

    try {
        const routine = await getRoutineById(id);
        if (routine.creatorId === req.user.id) {
            const deletedRoutine = await destroyRoutine(id)
            console.log('deleted routine: ', deletedRoutine)
            res.send(deletedRoutine);
        };
    } catch (error) {
        next(error)
    }
});

// POST /routines/:routineId/activities
routinesRouter.post('/:routineId/activities', requireUser, async (req, res, next) => {
    const { routineId } = req.params;
    const { activityId, count, duration } = req.body;
    try {
        const addedActivity = await addActivityToRoutine({ routineId, activityId, count, duration });
        res.send(addedActivity);
    } catch (error) {
        next(error)
    }
});

module.exports = routinesRouter;