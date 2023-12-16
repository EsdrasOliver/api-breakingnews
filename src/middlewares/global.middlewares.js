/* import mongoose from 'mongoose'
import userService from '../services/user.service.js'

export const validId = (req, res, next) => {
    try {
        const id = req.params.id

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid ID" })
        }

        next()
    } catch (err) {
        res.status(500).send({ message: err.message })
    } 
}

export const validUser = async (req, res, next) => {
    try {
        const id = req.params.id

        const user = await userService.findByIdService(id)

        if(!user) {
            return res.status(400).send({ message: "User not found" })
        }

        req.id = id
        req.user = user

        next()
    } catch (err) {
        res.status(500).send({ message: err.message })
    } 
} */

import mongoose from "mongoose";

export function validId(req, res, next) {
  let idParam;
  if (!req.params.id) {
    req.params.id = req.userId;
    idParam = req.params.id;
  } else {
    idParam = req.params.id;
  }

  if (!mongoose.Types.ObjectId.isValid(idParam)) {
    return res.status(400).send({ message: "Invalid id!" });
  }
  next();
}
