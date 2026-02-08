import express from "express";
import workspaceController from "../controllers/workspace.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import workspaceMiddleware from "../middlewares/workspace.middleware.js";
import { channelController } from "../controllers/channel.controller.js";
import channelMiddleware from "../middlewares/channel.middleware.js";
import messagesController from "../controllers/messages.controller.js";

const workspaceRouter = express.Router()

workspaceRouter.get('/',authMiddleware,workspaceController.getWorkspaces)

workspaceRouter.post('/', authMiddleware, workspaceController.create)

workspaceRouter.get('/:workspace_id',authMiddleware, workspaceMiddleware(), workspaceController.getById)

workspaceRouter.delete('/:workspace_id',authMiddleware,workspaceController.deleteWorkspace)

workspaceRouter.post(
    '/:workspace_id/members',
    authMiddleware, 
    workspaceMiddleware(['Owner', 'Admin']),
    workspaceController.addMemberRequest
)

workspaceRouter.get('/:workspace_id/members/accept-invitation',workspaceController.acceptInvitation)

workspaceRouter.post(
    '/:workspace_id/channels',
    authMiddleware,
    workspaceMiddleware(['Owner', 'Admin']),
    channelController.create
)

workspaceRouter.get(
    '/:workspace_id/channels',
    authMiddleware,
    workspaceMiddleware(),
    channelController.getAllByWorkspaceId
)

workspaceRouter.post(
    '/:workspace_id/channels/:channel_id/messages',
    authMiddleware,
    workspaceMiddleware(),
    channelMiddleware,
    messagesController.createMessage
)

workspaceRouter.get(
    '/:workspace_id/channels/:channel_id/messages',
    authMiddleware,
    workspaceMiddleware(),
    channelMiddleware,
    messagesController.getByChannelId
)

export default workspaceRouter