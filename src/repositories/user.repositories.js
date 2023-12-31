import User from "../models/User.js"

const createRepository = (body) => User.create(body)

const findAllUserRepository = () => User.find()

/* const findByIdRepository = (id) => User.findById(id) */

const findByIdUserRepository = (idUser) => User.findById(idUser)

const updateUserRepository = (id, body) => User.findOneAndUpdate({ _id: id },{ body }, { rawResult: true })

const findByEmailUserRepository = (email) => User.find({ email: email })

export default { createRepository, findAllUserRepository, findByIdUserRepository, updateUserRepository, findByEmailUserRepository }