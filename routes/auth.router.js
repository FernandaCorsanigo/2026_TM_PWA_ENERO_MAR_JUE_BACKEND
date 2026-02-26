import express from "express";
import authController from "../controllers/auth.controller.js";
import verifyApiKeyMiddleware from "../middlewares/verifyApiKey.middleware.js";

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