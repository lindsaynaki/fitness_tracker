const express = require ('express');
const activitiesRouter = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const { getAllActivities, createActivity } = require('../db/activities');
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
    try {
        const { name, description } = req.body;
        const activityData = {
            name,
            description
        };
        const activity = await createActivity(activityData);

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

module.exports = activitiesRouter;