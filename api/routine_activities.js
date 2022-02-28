// /api/routine_activities
const express = require('express');
const routineActivitiesRouter = express.Router();
const { getRoutineById, getRoutineActivityById, updateRoutineActivity, destroyRoutineActivity } = require('../db')
const { requireUser } = require('./util');

// PATCH /api/routine_activities/:routineActivityId
routineActivitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next) => {
    const id = req.params.routineActivityId;
    const { count, duration } = req.body

    try {
        const routineActivity = await getRoutineActivityById(id)
        const routine = await getRoutineById(routineActivity.routineId)

        if (routine.creatorId === req.user.id) {
            const updatedRoutineAct = await updateRoutineActivity({ id, count, duration })
            console.log('updated routine activity: ', updatedRoutineAct)
            res.send(updatedRoutineAct)
        } else {
            next({
                message: "You must be the owner of the routine activitiy"
            })
        }
    } catch (error) {
        next(error)
    }
})

// DELETE '/api/routine_activities/:routineActivityId
routineActivitiesRouter.delete('/:routineActivityId', requireUser, async (req, res, next) => {
    const id = req.params.routineActivityId;

    try {
        const routineActivity = await getRoutineActivityById(id)
        const routine = await getRoutineById(routineActivity.routineId)

        if (routine.creatorId === req.user.id) {
            const deletedRoutineActivity = await destroyRoutineActivity(id)
            res.send(deletedRoutineActivity)
        } else {
            next({
                message: "You must be the owner of the routine activitiy"
            })
        }
    } catch (error) {
        next(error)
    }
})

module.exports = routineActivitiesRouter;