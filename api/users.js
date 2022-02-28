const express = require('express');
const usersRouter = express.Router()
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const { getUserByUsername, createUser, getPublicRoutinesByUser } = require('../db');
const { requireUser } = require('./util');

// POST /users/register
usersRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const userObj = await getUserByUsername(username);

        if (userObj) {
            next({
                name: 'UserExistsError',
                message: 'A user by that username already exists'
            })
        } else if (password.length < 8) {
            next({
                name: 'PasswordLengthError',
                message: 'The password you entered is too short'
            })
        } else if (!username || !password) {
            next({
                name: 'MissingCredentials',
                message: 'You need a username and password to register'
            })
        } else {
            const user = await createUser({
                username,
                password
            });

            const token = jwt.sign({
                id: user.id,
                username
            }, process.env.JWT_SECRET)
            res.send({
                user,
                message: "thank you for signing up",
                token
            });
        }
    } catch (error) {
        next(error)
    }

});

// POST /users/login
usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        next({
            name: "MissingCredentialsError",
            message: "Please enter both username and password"
        });
    }

    try {
        const user = await getUserByUsername(username);
        const isMatch = await bcrypt.compare(password, user.password)

        if (user && isMatch) {
            const token = jwt.sign(user, JWT_SECRET);
            res.send({ token, message: "Thank you for logging in" })
        } else {
            next({
                name: "IncorrectCredentialsError",
                message: "Username or Password incorrect"
            })
        }
    } catch (error) {
        next(error);
    }
})

// GET /users/me
usersRouter.get('/me', requireUser, async (req, res, next) => {
    try {
        res.send(req.user)
    } catch (error) {
        next(error)
    }
})

// GET /users/:username/routines
usersRouter.get('/:username/routines', async (req, res, next) => {
    const { username } = req.params
    try {
        const routines = await getPublicRoutinesByUser({ username })
        res.send(routines);
    } catch (error) {
        next(error)
    }
})

module.exports = usersRouter;