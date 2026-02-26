
import ENVIRONMENT from "../config/enviroment.config.js"
import mail_transporter from "../config/mail.config.js"
import ServerError from "../helpers/error.helpers.js"
import { channelRepository } from "../repository/channel.repository.js"
import userRepository from "../repository/user.repository.js"
import workspaceRepository from "../repository/workspace.repository.js"
import jwt from "jsonwebtoken"
class WorkspaceController {
    async getWorkspaces(request, response) {
        console.log("El usuario logueado es: " + request.user)
        const user_id = request.user.id
        const workspaces = await workspaceRepository.getWorkspacesByUserId(user_id)
        response.json({
            ok: true,
            data:
            {
                workspaces
            }
        })
    }
    async create(request, response, next) {
        const { title, description } = request.body
        const user_id = request.user.id
        const workspace = await workspaceRepository.create(user_id, title, null, description)
        await workspaceRepository.addMember(workspace._id, user_id, 'Owner')

        const channel = await channelRepository.create(
            workspace._id,
            'all-test',
            true
        )

        response.json({
            ok: true,
            data: {
                workspace: {
                    _id: workspace._id,
                    title: workspace.title,
                    description: workspace.description,
                    image: workspace.image,
                    channels: [channel]
                }
            }
        })
    }
    async deleteWorkspace(request, response, next) {
        const user_id = request.user.id
        const { workspace_id } = request.params

        const workspace_selected = await workspaceRepository.getById(workspace_id)
        if (!workspace_selected) {
            throw new ServerError('Workspace not found', 404)
        }
        const member_info = await workspaceRepository.getMembersByWorkspaceIdAndUserId(workspace_id, user_id)

        if (member_info.role !== 'Owner') {
            throw new ServerError('You don\'t have permission to delete this workspace', 403)
        }
        await workspaceRepository.delete(workspace_id)
        response.json({
            ok: true,
            message: 'Espacio de trabajo eliminado con exito',
            data: null,
            status: 200
        })
    }

    async addMemberRequest(request, response, next) {
        const { email, role } = request.body
        const { workspace } = request
        const user_to_invite = await userRepository.buscarPorEmail(email)
        if (!user_to_invite) {
            throw new ServerError('The email of the invited user does not exist', 404)
        }

        const already_member = await workspaceRepository.getMembersByWorkspaceIdAndUserId(workspace._id, user_to_invite._id)

        if (already_member) {
            throw new ServerError('The user already belongs to this workspace', 400)
        }

        const token = jwt.sign({
            id: user_to_invite._id,
            email,
            workspace: workspace._id,
            role
        },
            ENVIRONMENT.JWT_SECRET,
        )

        await mail_transporter.sendMail(
            {
                to: email,
                from: ENVIRONMENT.GMAIL_USERNAME,
                subject: `You have been invited to ${workspace.title}`,
                html: `
                <h1>You have been invited to participate in the workspace: ${workspace.title}</h1>
                <p> If you don't recognize this invitation, disregard this email </p>
                <p>Click on 'Accept invitation' to accept the invitation</p>
                <a href="${ENVIRONMENT.URL_BACKEND}/api/workspace/${workspace._id}/members/accept-invitation?invitation_token=${token}">Accept invitation</a>
                `
            }
        )

        return response.json(
            {
                status: 201,
                ok: true,
                message: 'Invitacion enviada con exito',
                data: null
            }
        )
    }

    async acceptInvitation(request, response, next) {
        const { invitation_token } = request.query
        const payload = jwt.verify(invitation_token, ENVIRONMENT.JWT_SECRET)
        const { id, workspace: workspace_id, role } = payload
        await workspaceRepository.addMember(id, workspace_id, role)
        response.redirect(`${ENVIRONMENT.URL_FRONTEND}/`)
    }
    async getById(request, response, next) {
        const { workspace, member } = request
        response.json({
            ok: true,
            status: 200,
            data: {
                workspace,
                member
            },
            message: 'Espacio de trabajo seleccionado'
        })
    }
}
const workspaceController = new WorkspaceController()

export default workspaceController