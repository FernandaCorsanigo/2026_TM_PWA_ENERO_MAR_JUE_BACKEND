import { channelRepository } from "../repository/channel.repository.js"

class ChannelController {
    async getAllByWorkspaceId(request, response, next) {
        const { workspace_id } = request.params
        const channels = await channelRepository.getAllByWorkspaceId(workspace_id)
        response.json({
            status: 200,
            ok: true,
            message: 'Canales obtenidos con exito',
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
            message: 'Canal creado con exito',
            data: {
                channel_created
            },
        })
    }
    async delete(request, response, next) {
        const { channel_id } = request.params
        const channel = await channelRepository.getByIdAndWorkspaceId(channel_id, request.workspace._id)
        if (!channel) {
            throw new ServerError('Canal no encontrado', 404)
        }
        if (channel.is_default) {
            throw new ServerError('No se puede eliminar el canal por defecto', 400)
        }
        await channelRepository.delete(channel_id)
        response.json({
            status: 200,
            ok: true,
            message: 'Canal eliminado con exito',
            data: null,
        })
    }
}

const channelController = new ChannelController()

export { channelController }