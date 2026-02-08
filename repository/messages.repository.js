import ChannelMessages from "../models/ChannelMessages.model.js";
class MessagesRepository {
    async createMessage(member_id, channel_id, content) {
        return await ChannelMessages.create({
            fk_id_workspaceMember: member_id,
            fk_id_workspaceChannel: channel_id,
            content: content
        })
    }

    async getAllByChannelId(channel_id){
        const messages =await ChannelMessages.find({fk_id_workspaceChannel: channel_id}) // estoy haciendo un "find" sobre ChannelMessages, de ahi "expando" la propiedad de fk_id_workspaceMember
        .populate( //populate permite expandir ciertas propiedades, para obtener las detalles/referencias 
        // las unicas propiedades donde se puede usar el populate es cuando hay referencias a otras colecciones 
            {
                path: 'fk_id_workspaceMember',
                select: 'role fk_id_user',
                populate:{
                    path: 'fk_id_user',
                    select: 'username email'// permite seleccionar ciertas cosas del usuario, ya que sino daria toda la info del usuario incuyendo la contrasena y eso esta mal
                }
            }
        )
        .populate(
            {
                path: 'fk_id_workspaceChannel',
                select: 'name'
            }
        )
        return messages
    }

}

const messagesRepository = new MessagesRepository()

export default messagesRepository