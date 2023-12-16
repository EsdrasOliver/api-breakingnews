/* import User from "../models/User.js"

const createService = (body) => User.create(body)

const findAllService = () => User.find()

const findByIdService = (id) => User.findById(id)

const updateService = (id, name, username, email, password, avatar, background) => User.findOneAndUpdate({ _id: id },{ name, username, email, password, avatar, background })

export default { createService, findAllService, findByIdService, updateService } */

import userRepositories from '../repositories/user.repositories.js'
import authService from '../services/auth.service.js'
import bcrypt from 'bcrypt'

/* import userService from '../services/user.service.js' */

const createUserService = async (body) => {
    /* try { */
        /* const {name, username, email, password, avatar, background} = req.body */

        /* if(!name || !username || !email || !password || !avatar || !background) {
            res.status(400).send({ message: "Record missing"})
        } */

        const {name, username, email, password, avatar, background} = body

        if(!name || !username || !email || !password || !avatar || !background) throw new Error("Submit all fields for registration")

        /* const newUser = { name, username, email, password, avatar, background } */

        const foundUser = await userRepositories.findByEmailUserRepository(email)

        /* if(!foundUser){
            return res.status(400).send({ message: "User already exists" })
        } */

        if(!foundUser) throw new Error("User already exists")

        const user = await userRepositories.createRepository(newUser)

        /* if(!user){
            return res.status(400).send({ message: "Erro creating user" })
        } */

        if(!user) throw new Error("Erro creating user")

        const token = authService.generateToken(user.id)

        return {
            user: {
                id: user._id,
                name, 
                username, 
                email,  
                avatar, 
                background
            }, 
            token
        }
    /* } catch (err) {
        res.status(500).send({ message: err.message })
    } */
}

/* const findAllUser = async (req, res) => {
    try {
        const users = await userService.findAllService()

        if(users.length === 0) {
            return res.status(400).send({ message: "There are no registered users" })
        }

        res.send(users)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
} */

const findAllUserService = async () => {
    const users = await userRepositories.findAllUserRepository()

    if(users.length === 0) throw new Error("There are no registered users")

    return users
}

/* const findById = async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    } catch (err) {
        res.status(500).send({ message: err.message })
    } 
} */

const findByIdUserService = async (userId, userIdLogged) => {
    let idParams
    
    if(!userId) {
        userId = userIdLogged
        idParams = userId
    } else {
        idParams = userId
    }
    if(!idParams)
        throw new Error("Send an id in the parameters to search for the user")

    const user = await userRepositories.findByIdUserRepository(idParams)

    return user
}

/* const update = async (req, res) => {
    try {
        const { name, username, email, password, avatar, background } = req.body

        if(!name && !username && !email && !password && !avatar && !background) {
            res.status(400).send({ message: "Submit at least one field for update"})
        }

        const {id, user} = req

        await userService.updateService(
            id, 
            name,
            username,
            email,
            password,
            avatar,
            background
        )

        res.send({ message: "User sucessfully updated!" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    } 
} */

const updateUserService = async (body, userId) => {
    const { name, username, email, password, avatar, background } = body

    if(!name && !username && !email && !password && !avatar && !background) throw new Error("Submit at least one field for update the user")
    
    const user = await userRepositories.findByIdUserRepository(id)

    if(user._id != userId) throw new Error("You cannot update this user")

    if(password) password = await bcrypt.hash(password, 10)

    await userRepositories.updateUserRepository(userId, body)

    return { message: "User sucessfully updated!" }
}

/* export default { createService, findAllService, findByIdService, updateService } */

export default { createUserService, findAllUserService, findByIdUserService, updateUserService }