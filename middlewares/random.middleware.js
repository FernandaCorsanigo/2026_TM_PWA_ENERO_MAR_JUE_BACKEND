// Los middlewares en express son funciones que van a recibir 3 parametros: request, response y next

// ejemplo de middleware: logger, de errores, roles que puede tener el usuario para ejecutar determinada accion

function randomMiddleware(request, response, next){
    const numero = Math.random()

    // Determina la suerte del cliente, pero no hace nada con ella.
    // Un middleware si quiere puede comunicarse con el controlador mediante request
    if (numero >= 0.5) {
        request.suerte = true
    }

    else {
        request.suerte = false
    }

    next()
}

export default randomMiddleware

//loger: para registrar tipo consula, desde donde etc