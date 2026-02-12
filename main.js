import { connectMongoDB } from "./config/mongoDB.config.js"
import userRepository from "./repository/user.repository.js"
import express, { response } from "express"
import authRouter from "./routes/auth.router.js"
import verifyApiKeyMiddleware from "./middlewares/verifyApiKey.middleware.js"
import cors from "cors"
import workspaceRouter from "./routes/workspace.router.js"
import errorMiddleware from "./middlewares/error.middleware.js"

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

//app.use(verifyApiKeyMiddleware)

//Lo siguiente es para verificar que se esta ejecutando correctamente

app.get(
    '/', //direccion donde espero recibir la consulta "la oficina" digamos
    (request, response) => { // funcion en flecha que recibe response y request y response es el objeto de respuesta
        response.send('Aplicacion ejecutandose correctamente')
    }
)

app.use('/api/auth', authRouter) //Esto significa que la ruta /api/auth va a estar asociada al archivo auth.router.js
app.use("/api/workspace", verifyApiKeyMiddleware, workspaceRouter)

app.use(errorMiddleware)

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

/* 
//Quiero crear un espacio de trabajo de prueba
*/
/*
async function crearEspacioDeTrabajo (){

    //Creo el espacio de trabajo de prueba
    const workspace = await workspaceRepository.create(
        '696879956a03e7636b47b4e0', //Remplazen por su id
        'test',
        'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'Descripcion del espacio de trabajo'
    )
    //Me agrego como miembro
    await workspaceRepository.addMember(workspace._id, '696879956a03e7636b47b4e0', 'Owner')
}

crearEspacioDeTrabajo()

/* 
1ero:
    Crear espacio de trabajo
    Agregar miembro

2do: Crear endpoint para obtener espacios de trabajo asociados al usuario
3ro: Probar con postman
*/

/* messagesRepository.getAllByChannelId('6985bdb9842915bb16f228a4').then(result => console.log((JSON.stringify(result))))//.then(result => console.log(result)) */