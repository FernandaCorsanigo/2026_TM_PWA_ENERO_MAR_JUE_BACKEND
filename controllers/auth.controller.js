import ENVIRONMENT from "../config/enviroment.config.js"
import userRepository from "../repository/user.repository.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import mail_transporter from "../config/mail.config.js"
import ServerError from "../helpers/error.helpers.js"
class AuthController {
    async register(request, response) {
        try {

            const { email, password, username } = request.body

            if (!email || !password || !username) {
                throw new ServerError('Error: nombre, email o usuario invalido', 400)
            }

            const user = await userRepository.buscarPorEmail(email)
            if (user) {
                throw new ServerError('Email ya registrado', 400)
            }

            // Para encriptar contrasenas: usar brcrypt
            // A partir delhash puedo COMPARARLO con el texto original
            // Instalamos npm i bcrypt

            let hashed_password = await bcrypt.hash(password, 10) // el nro 10 representa la 'complejidad' de la contrasena que va a generar, para este tipo de desafio se elige entre 10 & 12
            await userRepository.crear(email, hashed_password, username)

            const verification_email_token = jwt.sign(
                {
                    email: email
                },
                ENVIRONMENT.JWT_SECRET,
                /*{
                    expiresIn: '7d'
                }
                    */
            )

            await mail_transporter.sendMail(
                {
                    from: ENVIRONMENT.GMAIL_USERNAME,
                    to: email,
                    subject: 'Verifica tu email',
                    html: `
                    <h1>Bienvenido ${username}</h1>
                    <p>Necesitamos que verifiques tu email</p>
                    <p>Haz click en "Verificar" para verificar tu mail</p>
                    <a href="http://localhost:8080/api/auth/verify-email?verification_email_token=${verification_email_token}">Verificar</a>
                    <br>
                    <span>Si desconoces este registro, desestima este mail</span>
                    `
                }
            )

            return response.json({
                message: 'Usuario creado exitosamente',
                status: 201,
                ok: true,
                data: null
            })
        }
        catch (error) {
            if (error.status) {
                return response.json({
                    ok: false,
                    message: error.message,
                    status: error.status,
                    data: null
                })
            }

            return response.send({
                message: 'Error interno del servidor',
                status: 500,
                of: false,
                data: null
            })
        }
    }

    async login(request, response) {
        try {
            const { email, password } = request.body
            //Aplicar validaciones del email y la password//
            if (!email) {
                throw new ServerError('Debes enviar un mail', 400)
            }
            else if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))) {
                throw new ServerError('El email no es valido', 400)
            }
            const usuario_encontrado = await userRepository.buscarPorEmail(email)

            if (!usuario_encontrado) {
                throw new ServerError('Credenciales invalidas', 401)
            }

            if (!(await bcrypt.compare(password, usuario_encontrado.password))) {
                throw new ServerError('Credenciales invalidas', 401)
            }

            if (!usuario_encontrado.email_verified) {
                throw new ServerError('Usuario con email no verificado', 401)
            }

            const datos_del_token = {
                username: usuario_encontrado.username,
                email: usuario_encontrado.email,
                id: usuario_encontrado.id,
            }

            const auth_token = jwt.sign(datos_del_token, ENVIRONMENT.JWT_SECRET)
            // siempre deberia devolver un objeto
            return response.json({
                message: 'Inicio de sesion exitoso', // un mensajito descriptivo relacionado a la accion
                ok: true, //para saber si se hizo bien o no la accion
                status: 200,
                data: { // donde va toda la informacion respecto a la respuesta
                    auth_token: auth_token
                }
            })
        }

        catch (error) {
            if (error.status) {
                return response.json({
                    ok: false,
                    message: error.message,
                    status: error.status,
                    data: null
                })
            }

            return response.send({
                message: 'Error interno del servidor',
                status: 500,
                of: false,
                data: null
            })
        }
    }


    async verifyEmail(request, response) {
        try {
            const { verification_email_token } = request.query

            if (!verification_email_token) {
                throw new ServerError('Debes enviar un token de verificacion', 400)
            }

            const { email } = jwt.verify(
                verification_email_token,
                ENVIRONMENT.JWT_SECRET
            )

            const user_found = await userRepository.buscarPorEmail(email)

            if (!user_found) {
                throw new ServerError('No existe usuario con ese mail', 404)
            }

            if (user_found.email_verified) {
                throw new ServerError('Usuario ya verificado', 400)
            }

            await userRepository.actualizarPorId(
                user_found._id,
                {
                    email_verified: true
                }
            )

            /*return response.json(
                {
                    ok: true,
                    message: 'Usuario verificado exitosamente',
                    status: 200,
                    data: null
                }
            )*/

            //Redireccionamos al frontend
            return response.redirect(
                ENVIRONMENT.URL_FRONTEND + '/login?from=email-validated') // La query string email-validated es opcional
        }

        catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                return response.json(
                    {
                        ok: false,
                        message: 'Token de verificacion invalido',
                        status: 400,
                        data: null
                    }
                )
            }

            if (error.status) {
                return response.json({
                    ok: false,
                    message: error.message,
                    status: error.status,
                    data: null
                })
            }

            return response.send({
                message: 'Error interno del servidor',
                status: 500,
                of: false,
                data: null
            })
        }
    }
}

const authController = new AuthController()
export default authController

