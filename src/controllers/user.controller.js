import userService from '../services/user.service.js'

/* const create = async (req, res) => {
    try {
        const {name, username, email, password, avatar, background} = req.body

        if(!name || !username || !email || !password || !avatar || !background) {
            res.status(400).send({ message: "Record missing"})
        }

        const user = await userService.createService(req.body)

        if(!user){
            return res.status(400).send({ message: "Erro creating user" })
        }

        res.status(201).send({
            message: "User created sucessfully!",
            user: {
                id: user._id,
                name, 
                username, 
                email,  
                avatar, 
                background
            }
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
} */

const createUserController = async (req, res) => {
    const body = req.body

    try {
        const user = await userService.createUserService(body)
        return res.status(201).send(user)
    } catch (err) {
        return res.status(500).send(err.message)
    }
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

const findAllUserController = async (req, res) => {
    try {
        const users = await userService.findAllUserService()
        return res.send(users)
    } catch (err) {
        return res.status(500).send(err.message)
    }
}

/* const findById = async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    } catch (err) {
        res.status(500).send({ message: err.message })
    } 
} */

const findUserByIdController = async (req, res) => {
    const {id: userId} = req.params
    const userIdLogged = req. userId

    try {
        const user = await userService.findByIdUserService(userId, userIdLogged) 
        return res.send(user)
    } catch (err) {
        return res.status(500).send(err.message)
    } 
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

const updateUserController = async (req, res) => {
    const body = req.body
    const userId = req.userId

    try {
        const response = await userService.updateUserService(body, userId)

        return res.send(response)
    } catch (err) {
        return res.status(500).send({ message: err.message })
    } 
}

/* export default { create, findAllUser, findById, update } */

export default { createUserController, findAllUserController, findUserByIdController, updateUserController }