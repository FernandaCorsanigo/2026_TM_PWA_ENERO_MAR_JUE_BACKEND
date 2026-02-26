import { channelRepository } from "../repository/channel.repository.js"

class ChannelController {
    async getAllByWorkspaceId(request, response, next) {
        const { workspace_id } = request.params
        const channels = await channelRepository.getAllByWorkspaceId(workspace_id)
        response.json({
            status: 200,
            ok: true,
            message: 'Channels obtained successfully',
            data: {
                channels
            },
        })
    }
    async create(request, response, next) {
        const { name } = request.body
        const { workspace_id } = request.params

        const channel_created = await channelRepository.create(workspace_id, name)
        response.json({
            status: 201,
            ok: true,
            message: 'Channel created successfully',
            data: {
                channel_created
            },
        })
    }
    async delete(request, response, next) {
        const { channel_id } = request.params
        const channel = await channelRepository.getByIdAndWorkspaceId(channel_id, request.workspace._id)
        if (!channel) {
            throw new ServerError('Channel not found', 404)
        }
        if (channel.is_default) {
            throw new ServerError('Cannot delete default channel', 400)
        }
        await channelRepository.delete(channel_id)
        response.json({
            status: 200,
            ok: true,
            message: 'Channel deleted successfully',
            data: null,
        })
    }
}

const channelController = new ChannelController()

export { channelController }