/* 
Crear una ruta /api/auth
esta ruta tendra un endpoint que sea POST /register y hara lo que actualmente hace nuestro /auth/register
Aca tenemos 3 endpoints, los puntos finales:
*/

import express from "express";
import authController from "../controllers/auth.controller.js";
import verifyApiKeyMiddleware from "../middlewares/verifyApiKey.middleware.js";

const authRouter = express.Router()

authRouter.post(
    '/register',
    verifyApiKeyMiddleware,
    authController.register //>> el delegado para manejar el registro es el authController.register
)

authRouter.post(
    '/login',
    verifyApiKeyMiddleware,
    authController.login
)

authRouter.get(
    '/verify-email',
    verifyApiKeyMiddleware,
    authController.verifyEmail
)

export default authRouter