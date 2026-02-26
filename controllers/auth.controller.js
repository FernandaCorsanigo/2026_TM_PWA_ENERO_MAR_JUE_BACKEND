import ENVIRONMENT from "../config/enviroment.config.js"
import userRepository from "../repository/user.repository.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import mail_transporter from "../config/mail.config.js"
import ServerError from "../helpers/error.helpers.js"

class AuthController {
    async register(request, response, next) {
        const { email, password, username } = request.body

        if (!email || !password || !username) {
            throw new ServerError('Error: nombre, email o usuario invalido', 400)
        }

        const user = await userRepository.buscarPorEmail(email)
        if (user) {
            throw new ServerError('Email ya registrado', 400)
        }


        let hashed_password = await bcrypt.hash(password, 10)
        await userRepository.crear(email, hashed_password, username)

        const verification_email_token = jwt.sign(
            {
                email: email
            },
            ENVIRONMENT.JWT_SECRET,
        )

        await mail_transporter.sendMail(
            {
                from: ENVIRONMENT.GMAIL_USERNAME,
                to: email,
                subject: 'Very your email',
                html: `
                <h1> Welcome ${username}</h1>
                <p> We need you verify your email</p>
                <p> Click in "Verify" to verify your mail</p>
                <a href="${ENVIRONMENT.URL_BACKEND}/api/auth/verify-email?verification_email_token=${verification_email_token}">Verify</a>
                <br>
                <span>If you don’t recognize this record, please disregard this email.</span>
                `
            }
        )

        return response.json({
            message: 'User created successfully',
            status: 201,
            ok: true,
            data: null
        })
    }

    async login(request, response, next) {
        const { email, password } = request.body

        if (!email) {
            throw new ServerError('You must send an email', 400)
        }
        else if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))) {
            throw new ServerError('The email is not valid', 400)
        }
        const usuario_encontrado = await userRepository.buscarPorEmail(email)

        if (!usuario_encontrado) {
            throw new ServerError('Invalid credentials', 401)
        }

        if (!(await bcrypt.compare(password, usuario_encontrado.password))) {
            throw new ServerError('Invalid credentials', 401)
        }

        if (!usuario_encontrado.email_verified) {
            throw new ServerError('User with unverified email', 401)
        }

        const datos_del_token = {
            username: usuario_encontrado.username,
            email: usuario_encontrado.email,
            id: usuario_encontrado.id,
        }

        const auth_token = jwt.sign(datos_del_token, ENVIRONMENT.JWT_SECRET)
        return response.json({
            message: 'Login successful',
            ok: true,
            status: 200,
            data: {
                auth_token: auth_token
            }
        })
    }


    async verifyEmail(request, response, next) {
        const { verification_email_token } = request.query

        if (!verification_email_token) {
            throw new ServerError('You must send a verification token', 400)
        }

        const { email } = jwt.verify(
            verification_email_token,
            ENVIRONMENT.JWT_SECRET
        )

        const user_found = await userRepository.buscarPorEmail(email)

        if (!user_found) {
            throw new ServerError('No user exists with that email', 404)
        }

        if (user_found.email_verified) {
            throw new ServerError('User already verified', 400)
        }

        await userRepository.actualizarPorId(
            user_found._id,
            {
                email_verified: true
            }
        )

        return response.redirect(
            ENVIRONMENT.URL_FRONTEND + '/login?from=email-validated')
    }
}

const authController = new AuthController()
export default authController

