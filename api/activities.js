// api/activities
const express = require('express');
const activitiesRouter = express.Router();
const { getAllActivities, createActivity, updateActivity, getPublicRoutinesByActivity } = require('../db');
const { requireUser } = require('./util');

// GET api/activities
activitiesRouter.get('/', async (req, res, next) => {
    try {
        const activities = await getAllActivities();
        res.send(activities)
    } catch (error) {
        next(error)
    }
});

// POST /api/activities
activitiesRouter.post('/', requireUser, async (req, res, next) => {
    const { name, description } = req.body
    try {
        const activity = await createActivity({ name, description })
        res.send(activity)
        
    } catch (error) {
        next(error)
    }
})

// PATCH /api/activities/:activityId 
activitiesRouter.patch('/:activityId', requireUser, async (req, res, next) => {
    const { activityId } = req.params;
    const { name, description } = req.body;

    try {
        const updatedAct = await updateActivity({ id: activityId, name, description })
        res.send(updatedAct)
    } catch (error) {
        next(error)
    }
});


// GET /activities/:activityId/routines
activitiesRouter.get('/:activityId/routines', async (req, res, next) => {
    const { activityId } = req.params
    try {
        const activities = await getPublicRoutinesByActivity({ activityId })
        res.send(activities)
    } catch (error) {
        next(error)
    }
});

module.exports = activitiesRouter;