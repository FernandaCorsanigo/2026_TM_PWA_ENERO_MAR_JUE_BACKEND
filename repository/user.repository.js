import User from "../models/Users.model.js";

//Se hace con clase va a tener un metodo que se llama "crear" y va a recibir un mail, password y username, llamamos a User y usamos el metodo de InsertOne. Como se va a tardar le colocamos async y await. Es agnostica porque no sabe que vamos a hacer con lo que creamos/buscamos por ejemplo, luego eso se piede usar para muchas cosas
class UserRepository{
    async crear (email, password, username){
        await User.insertOne({email, password, username})
    }

    async buscarPorEmail (email){
        const user = await User.findOne({email})
        return user
    }

    async eliminarPorId (user_id){
        await User.findByIdAndDelete(user_id)
    }

    async desactivarPorId (user_id){
        const usuario = await User.findByIdAndUpdate(
            user_id, {
                active: false
            },
            {
                new: true // Que nos devuelva el registro actualizado
            }
        )
        //console.log(usuario)
        return usuario
    }

    async obtenerTodos (user_id){
        const usuarios = await User.find()
        return usuarios
    }

    async obtenerUnoPorId (user_id){
        const usuario = await User.findById(user_id)
        return usuario
    }

    async actualizarPorId (user_id, nuevosDatos){
        await User.findByIdAndUpdate(
            user_id,
            nuevosDatos,
            {
                new: true
            }
            )
    }
}
//Instanciamos la clase UserRepository lueho en main.js llamo a userRepository

const userRepository = new UserRepository()
export default userRepository