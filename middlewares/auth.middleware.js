/* 
Headers: especificaciones que van determinando el tipo de consulta que se hace al servidor.
Los headers de una consulta se guarden en 
request.headers 
y es un objeto con datos de la consulta como: IP, user agent, etc 
(En postman se puede ver el apartado de headers cuando hacemos peticiones)
Headers suele tener ciertos nombres de propiedades definidos (convention) ej:
- 'authorization' clave o token de sesion o lo que utilice como validacion,
- 'content-type' tipo de contenido de la peticion ej: json,
- 'x-api-key' clave de la api: clave secreta que se suele guardar entre 2 o mas sistemas 

Nosotros en esta cursada veremos la estrategia de auth 'Bearer' >> la barrera que vamos a estar poniendo de autentificacion es un token.
*/

import jwt from 'jsonwebtoken'
import ENVIRONMENT from '../config/enviroment.config.js'
import ServerError from '../helpers/error.helpers.js'

/* Tomar el token que envie el cliente y verificar:
    - Que exista, 
    - Que sea valido 
    - Guardar datos de sesion en el request
*/

function authMiddleware(request, response, next){
    try{
    //Normalmente el token de autentificacion se envia en el header 'Authorization'
        /* 
        Se suele enviar en este formato:
        'authorization': 'Bearer <token>' hay un espacio entre bearer y <token>
        */

        const authorization_header = request.headers.authorization

        if (!authorization_header){
            throw new ServerError('No autorizado', 401)
            //Cpn el throw no hace falta el return ya que lo envia directo al catch
            /*return response.json(
                {
                    ok: false,
                    message: 'No autorizado',
                    status: 401, //401 significa unauthorised, menos especifico & 400 significa bad request, ose que no se lleno bien el formulario
                    data: null
                }
            )*/
        }

        const auth_token = authorization_header.split(' ')[1] // el header va a venir como string, aca se transforma en array donde el primer valor es bearer y el segundo es el token, y de este array de 2 valores, selecciono el segundo (por eso el 1).

        if(!auth_token){
            throw new ServerError('No autorizado', 401)
            /* return response.json(
                {
                    ok: false,
                    message: 'No autorizado',
                    status: 401,
                    data: null
                }
            )
            */
        }

        const user = jwt.verify(auth_token, ENVIRONMENT.JWT_SECRET)

        /* Guardar los datos de sesion del usuario:
            {username, email, id}
        */

        request.user = user

        next()
    }
    

    catch(error){
        if (error instanceof jwt.JsonWebTokenError){
            return response.json(
                {
                    ok: false,
                    message: 'No autorizado',
                    status: 401,
                    data: null
                }
            )
        }

        /* Si tiene status decimos que es un error controlado (osea es esperable) */

        if (error.status){
            return response.json({
                ok: false,
                message: error.message,
                status: error.status,
                data: null
            })
        }

        return response.json({
            ok: false,
            message: 'Error interno del servidor',
            status: 500,
            data: null
        })
    }
}

export default authMiddleware

