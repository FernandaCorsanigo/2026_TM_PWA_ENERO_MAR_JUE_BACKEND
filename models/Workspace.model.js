import { create } from "domain";
import mongoose from "mongoose";
import { type } from "os";

const workspaceSchema = new mongoose.Schema({
    fk_id_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: true
    }
})

const Workspace = mongoose.model('Workspace', workspaceSchema)

export default Workspace