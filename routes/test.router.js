import express from "express";
import testController from "../controllers/test.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";


const testRouter = express.Router()

// Para probarlo, hacer un get GET con http://localhost:8080/api/test

// acordarse de hacer npm run dev primero para que se conecte al puerto 8080 con postman y demas

testRouter.get(
    '/', 
    testController.get
)

testRouter.get(
    '/authorized-test',
    authMiddleware,
    (request,response) => {
        console.log({user_data: request.user})
        return response.json(
            {
                ok: true,
                message: 'Test correcto',
                status: 200,
                data: null
            }
        )
    }
)

//Pra probarlo, ir a postman, hacer un get con http://localhost:8080/api/test/authorized-test, ir a authorization, seleccionar bearer token y pegar nuestro token, el que se genera cdo ponemos el login en el post (hecho en clases anteriores)

export default testRouter

/* 
Implementar la capa de controller en el authRouter
*/