/* import bcrypt from 'bcrypt'
import { loginService, generateToken } from '../services/auth.service.js'

const login = async (req, res) => {

    const { email, password } = req.body

    try {
        const user = await loginService(email)

        if(!user) {
            return res.status(404).send({ message: "User or password not found" })
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password)

        if(!passwordIsValid) {
            return res.status(400).send({ message: "User or password not found" })
        }

        const token = generateToken(user.id)

        res.send({token})
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export { login } */

import authService from "../services/auth.service.js";

const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await authService.loginService({ email, password });
    return res.send(token);
  } catch (e) {
    return res.status(401).send(e.message);
  }
};

export default { loginController };