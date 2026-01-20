import mongoose from "mongoose";
import { type } from "os";

const ChannelMessagesSchema = new mongoose.Schema({
    fk_id_workspaceChannel :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        required: true
    },
    fk_id_workspaceMember: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MemberWorkspace',
        required: true
    },
    created_at :{
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        required: true
    }
})

const ChannelMessages = mongoose.model('ChannelMessages', ChannelMessagesSchema)

export default ChannelMessages