const express = require ('express');
const activitiesRouter = express.Router();
const { getAllActivities, createActivity, updateActivity, getActivityById } = require('../db/activities');
const { getPublicRoutinesByActivity } = require('../db/routines')
const { requireUser } = require('./util');

activitiesRouter.get('/', async (req, res, next) => {
    try{
    const activities = await getAllActivities();
    res.send(activities)
    }catch(error){
    next(error)
    }
});

activitiesRouter.post('/', requireUser, async (req, res, next) => {
    const { name, description } = req.body;
    try {
        const activity = await createActivity({name, description});

        if (activity) {
            res.send(activity);
        } else {
            next({
                name: "CreateActivityError",
                message: "You must be logged in to create an activity"
            })
        }
    }catch(error){
    next(error)
    }
});

activitiesRouter.patch('/:activityId', requireUser, async (req, res, next) => {
    const { activityId } = req.params;
    const { name, description} = req.body;
    const updateFields = {};

    if (name) {
        updateFields.name = name;
    }

    if (description) {
        updateFields.description = description;
    }
    
    try {
        const updatedActivity = await updateActivity(activityId, updateFields);
        res.send({ activity: updatedActivity})
    } catch(error){
    next(error)
    }
});

activitiesRouter.get('/:activityId/routines', async (req, res, next) => {
    const { activityId } = req.params;
    try {
        const routines = await getPublicRoutinesByActivity(activityId);
        res.send(routines);
    }catch(error){
    next(error)
    }

});

module.exports = activitiesRouter;