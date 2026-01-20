import User from "./models/Users.model.js"
import { connectMongoDB } from "./config/mongoDB.config.js"
import userRepository from "./repository/user.repository.js"
import express, { response } from "express"
import testRouter from "./routes/test.router.js"
import authRouter from "./routes/auth.router.js"
import mail_transporter from "./config/mail.config.js"
import ENVIRONMENT from "./config/enviroment.config.js"
import randomMiddleware from "./middlewares/random.middleware.js"
import cors from "cors"

connectMongoDB()

//Modelos >> permiten organizar nuestra base de datos y darle un orden a MongoDB



/* crearUsuario('pepe@gmail.com','1234','pepe')*/

//userRepository.crear('ana@gmail.com', 'ana1234', 'ana')

userRepository.desactivarPorId('6943715fc662fdf18f803e43')

//Descargar npm i express >> es un framework que sirve para crear un servidor web >> APIs que vamos a crear//

//Crear un servidor wen

// Lee el request.header.['content-type'] y si el valor es application/json entonces guarda en request.body el json transformado

const app = express()

// Politica de CORS: por seguridad no permite la comunicaciona a un servidor con dominio distinto al que estamos usando, pero en este caso lo queremos para conectarnos con el backend.

// instalar npm install cors para cuando como en nuestro caso necesitamos hacer consultas desde otros dominios 

app.use(cors())

//express tambien es un middleware

//Habilita a mi servidor a recibir jason por body

//Cuando no ponemos esta configuracion, lo pone como indefinido porque el que hace la transformacion es express

app.use(express.json())

//Lo siguiente es para verificar que se esta ejecutando correctamente

app.get(
    '/', //direccion donde espero recibir la consulta "la oficina" digamos
    (request,response) => { // funcion en flecha que recibe response y request y response es el objeto de respuesta
        response.send('Aplicacion ejecutandose correctamente')
    }
)

app.get(
    '/test',
    (request, response) => {
        response.send('Estas testeando el servidor')
    }
)

app.post(
    '/test',
    (request, response) => {
    // Request.body es donde se guarda la informacion que nos envia el cliente
        console.log(request.body)
        response.send('Gracias por el objeto')
    }
)

// Todas las consultas hacia /api/test la delegamos al test Router

app.use('/api/test', testRouter)

app.use('/api/auth', authRouter)


// Le tenemos que poner una direccion donde se va a ejecutar

app.listen(
    8080, 
    () => {
        console.log('Nuestra app se escucha en el puerto 8080')
})

/*
mail_transporter.sendMail({
    from: ENVIRONMENT.GMAIL_USERNAME,
    to: ENVIRONMENT.GMAIL_USERNAME,
    subject: 'Esto es un mail de prueba',
    html: '<b>Esto es un mail de prueba</b>'
})

*/

app.get(
    '/api/suerte/saber',
    randomMiddleware, //nose invoca, no se le pone () al final
    (request,response) => {
        if (request.suerte) { // Suerte esta definido porque el middle ware lo determino
            response.send('Tenes suerte')
        }
        else {
            response.send('No tenes suerte')
        }
    }
)   