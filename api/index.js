// api
const express = require('express');
const apiRouter = express.Router();
const { getUserById } = require('../db');

// JWT
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// GET api/health
apiRouter.get('/health', (req, res, next)=> {
    res.send ({
        message: "The server is healthy"
    })

});

// Authorization
apiRouter.use(async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');

    if (!auth) {
        next();
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length);

        try {
            const { id } = jwt.verify(token, JWT_SECRET);

            if (id) {
                const user = await getUserById(id);
                req.user = user;
                next();
            }
        } catch ({ name, message }) {
            next({ name, message })
        }
    } else {
        next({
            name: 'AuthorizationHeaderError',
            message: `Authorization token must start with ${prefix}`
        });
    }
});

// Routers
const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

const activitiesRouter = require('./activities');
apiRouter.use('/activities', activitiesRouter);

const routinesRouter = require('./routines');
apiRouter.use('/routines', routinesRouter);

// const routineActivitiesRouter = require('./routine_activities');
// apiRouter.use('/routine_activities', routineActivitiesRouter);


module.exports = apiRouter;