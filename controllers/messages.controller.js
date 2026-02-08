import  messagesRepository from "../repository/messages.repository.js"

class MessagesController {
    async createMessage (request, response) {
        try{
            const {content} = request.body // obtenemos el contenido del mensaje
            const member_id = request.member._id // obtenemos quien esta creando el mensaje
            const {channel_id} = request.params //obtenemos en donde se va a crear el mensaje

            await messagesRepository.createMessage(member_id, channel_id, content)

            return response.json({
                status: 201,
                ok: true,
                message: 'Mensaje creado con exito',
            })
        }
        catch (error) {
            console.log('Error en crear mensaje',error)
            if (error.status) {
                return response.status(error.status).json({
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

    async getByChannelId(request, response){
        try{
            const {channel_id} = request.params

            const messages= await messagesRepository.getAllByChannelId(channel_id)

            return response.json({
                status: 200,
                ok: true,
                message: 'Mensajes obtenidos con exito',
                data: {
                    messages
                }
            })
        }
        catch (error) {
            console.log('Error en crear mensaje',error)
            if (error.status) {
                return response.status(error.status).json({
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

const messagesController = new MessagesController()

export default messagesController