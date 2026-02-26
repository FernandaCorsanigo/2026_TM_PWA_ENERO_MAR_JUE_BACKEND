import messagesRepository from "../repository/messages.repository.js"

class MessagesController {
    async createMessage(request, response, next) {

        const { content } = request.body
        const member_id = request.member._id
        const { channel_id } = request.params

        await messagesRepository.createMessage(member_id, channel_id, content)

        const messages = await messagesRepository.getAllByChannelId(channel_id)

        return response.json({
            status: 201,
            ok: true,
            message: 'Message created successfully',
            data: {
                messages: messages
            }
        })
    }

    async getByChannelId(request, response, next) {
        const { channel_id } = request.params

        const messages = await messagesRepository.getAllByChannelId(channel_id)

        return response.json({
            status: 200,
            ok: true,
            message: 'Messages obtained successfully',
            data: {
                messages: messages
            }
        })
    }

}

const messagesController = new MessagesController()

export default messagesController