import mongoose from "mongoose";
import { type } from "os";

const ChannelSchema = new mongoose.Schema({
    fk_id_workspace :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    created_at :{
        type: Date,
        default: Date.now
    },
    name :{
        type: String,
        required: true
    }, 
    active: {
        type: Boolean,
        default : true
    }   
})

const Channel = mongoose.model('Channel', ChannelSchema)

export default Channel