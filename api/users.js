const express = require ('express');
const usersRouter = express.Router()
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const { getUserByUsername, createUser } = require('../db/users');

usersRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    try{
        const userObj = await getUserByUsername(username);
        
        if (userObj) {
            next({
                name: 'UserExistsError',
                message: 'A user by that username already exists'
            })
        } else if (password.length < 8){
            next({
                name: 'PasswordLengthError',
                message: 'The password you entered is too short'
            })
        } else if (!username || !password){
            next({
                name: 'MissingCredentials',
                message: 'You need a username and password to register'
            })
        } else{
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

// usersRouter.post('/login', async (req, res, next) => {
//     const {usernam, password} = req.body;

//     if(!username || !password) {
//         next({
//             name: "MissingCredentialsError",
//             message: "Please enter both username and password"
//         });
//     }

//     try {
//         const user = await getUserByUsername(username);

//         if(user && user.password === password){

//         }
//     }
// })

module.exports = usersRouter;