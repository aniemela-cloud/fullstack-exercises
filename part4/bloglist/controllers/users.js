const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.post('/', async (request, response) => {
    if (!request || !request.body) {
        // the request object is ... unlikely to not exist,
        // but the request.body can be non-existent if no JSON
        // of any kind was given as part of the HTTP request
        return response.status(400).json({
            error: 'request body missing'
        })
    }
    const { username, name, password } = request.body
    if(!username) {
        return response.status(400).json({
            error: 'username missing'
        })
    }
    if(!name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if(!password) {
        return response.status(400).json({
            error: 'password missing'
        })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    try {
        const user = new User({
            username,
            name,
            passwordHash
        })
        const savedUser = await user.save()
        response.status(201).json(savedUser)
    } catch(err) {
        if (err.name === 'MongoServerError' && err.message.includes('E11000 duplicate key error')) {
            return response.status(400).json({ error: 'expected `username` to be unique' })
        }
        else {
            return response.status(400).json({
                error: err.message
            })
        }
    }
})
userRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})


module.exports = userRouter