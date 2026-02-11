import ENVIRONMENT from '../config/enviroment.config.js'

const verifyApiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key']

    if (apiKey !== ENVIRONMENT.API_KEY) {
        return res.status(401).json({
            status: 401,
            ok: false,
            message: 'Acceso no autorizado: API Key invalida o ausente',
            data: null
        })
    }

    next()
}

export default verifyApiKeyMiddleware
