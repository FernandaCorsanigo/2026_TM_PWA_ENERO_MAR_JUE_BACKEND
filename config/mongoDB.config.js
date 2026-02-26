import mongoose from "mongoose";
import ENVIRONMENT from "./enviroment.config.js"

const connection_string = `${ENVIRONMENT.MONGO_DB_URI}/${ENVIRONMENT.MONGO_DB_NAME}` //Poner luego de la barra del .net algo mas para hacerlo en esa base de datos porque si no se hace en la base de datos del testeo y no queremos eso

export async function connectMongoDB() {

    try {

        await mongoose.connect(
            connection_string)
        console.log("Conexion a MongoDB exitosa")
    }
    catch (error) {
        console.error("Conexion con MongoDB fallo")
        console.error(error)
    }

}