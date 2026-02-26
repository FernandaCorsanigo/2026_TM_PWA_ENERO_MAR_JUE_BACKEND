import ChannelMessages from "../models/ChannelMessages.model.js";
class MessagesRepository {
    async createMessage(member_id, channel_id, content) {
        return await ChannelMessages.create({
            fk_id_workspaceMember: member_id,
            fk_id_workspaceChannel: channel_id,
            content: content
        })
    }

    async getAllByChannelId(channel_id) {
        const messages = await ChannelMessages.find({ fk_id_workspaceChannel: channel_id })
            .populate(
                {
                    path: 'fk_id_workspaceMember',
                    select: 'role fk_id_user',
                    populate: {
                        path: 'fk_id_user',
                        select: 'username email'
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