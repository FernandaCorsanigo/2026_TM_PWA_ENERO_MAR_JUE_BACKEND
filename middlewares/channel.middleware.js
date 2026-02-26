import ServerError from "../helpers/error.helpers.js"
import { channelRepository } from "../repository/channel.repository.js"

async function channelMiddleware(request, response, next) {
    try {
        const { channel_id, workspace_id } = request.params

        const channel_selected = await channelRepository.getByIdAndWorkspaceId(channel_id, workspace_id)

        if (!channel_selected) {
            throw new ServerError('Canal no existe', 404)
        }

        request.channel = channel_selected
        next()
    }
    catch (error) {
        if (error.status) {
            return response.json({
                ok: false,
                message: error.message,
                status: error.status,
                data: null
            })
        }

        return response.json({
            ok: false,
            message: 'Error interno del servidor',
            status: 500,
            data: null
        })
    }
}

export default channelMiddleware