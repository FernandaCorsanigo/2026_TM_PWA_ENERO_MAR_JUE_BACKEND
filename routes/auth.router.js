/* 
Crear una ruta /api/auth
esta ruta tendra un endpoint que sea POST /register y hara lo que actualmente hace nuestro /auth/register
*/

import express from "express";
import authController from "../controllers/auth.controller.js";

const authRouter = express.Router()

authRouter.post(
    '/register',
    authController.register
)

authRouter.post(
    '/login',
    authController.login
    )

authRouter.get(
    '/verify-email',
    authController.verifyEmail
)

export default authRouter