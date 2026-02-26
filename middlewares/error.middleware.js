const errorMiddleware = (err, req, res, next) => {

    if (err.status) {
        return res.status(err.status).json({
            ok: false,
            message: err.message,
            status: err.status,
            data: null
        })
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(400).json({
            ok: false,
            message: 'Token de verificacion invalido',
            status: 400,
            data: null
        })
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            ok: false,
            message: 'Token expirado',
            status: 401,
            data: null
        })
    }

    return res.status(500).json({
        ok: false,
        message: 'Error interno del servidor',
        status: 500,
        data: null
    })
}

export default errorMiddleware
