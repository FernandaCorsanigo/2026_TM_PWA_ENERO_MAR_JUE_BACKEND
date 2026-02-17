import Channel from '../models/Channels.model.js'

class ChannelRepository {
    async create(workspace_id, name, is_default) {
        return await Channel.create({ name: name, fk_id_workspace: workspace_id, is_default })
    }

    async getAllByWorkspaceId(workspace_id) {
        return await Channel.find({ fk_id_workspace: workspace_id })
    }

    async getByIdAndWorkspaceId(channel_id, workspace_id) {
        return await Channel.findOne({ _id: channel_id, fk_id_workspace: workspace_id }) //findOne asi trae uno solo
    }
}

const channelRepository = new ChannelRepository()

export { channelRepository }