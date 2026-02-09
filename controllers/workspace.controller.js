
import ENVIRONMENT from "../config/enviroment.config.js"
import mail_transporter from "../config/mail.config.js"
import ServerError from "../helpers/error.helpers.js"
import userRepository from "../repository/user.repository.js"
import workspaceRepository from "../repository/workspace.repository.js"
import jwt from "jsonwebtoken"
class WorkspaceController {
    async getWorkspaces(request, response) { // Quiero obtener los espacios de trabajos asociados al usuario que hace la consulta
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
    async create(request, response) {
        try {
            const { title, /*image*/ description } = request.body
            const user_id = request.user.id
            const workspace = await workspaceRepository.create(user_id, title, null, description)
            await workspaceRepository.addMember(workspace._id, user_id, 'Owner')
            response.json({
                ok: true,
                data: {
                    workspace
                }
            })
        }
        catch (error) {
            if (error.status) {
                return response.status(error.status).json({
                    ok: false,
                    message: error.message,
                    status: error.status,
                    data: null
                })
            }
            console.error(error)
            return response.send({
                message: 'Error interno del servidor',
                status: 500,
                of: false,
                data: null
            })
        }
    }
    async deleteWorkspace(request, response) {
        try {
            const user_id = request.user.id
            const { workspace_id } = request.params

            const workspace_selected = await workspaceRepository.getById(workspace_id)
            if (!workspace_selected) {
                throw new ServerError('Espacio de trabajo no encontrado', 404)
            }
            const member_info = await workspaceRepository.getMembersByWorkspaceIdAndUserId(workspace_id, user_id)

            if (member_info.role !== 'Owner') {
                throw new ServerError('No tienes permiso para eliminar este espacio de trabajo', 403)
            }
            await workspaceRepository.delete(workspace_id)
            response.json({
                ok: true,
                message: 'Espacio de trabajo eliminado con exito',
                data: null,
                status: 200
            })
        }
        catch (error) {
            if (error.status) {
                return response.status(error.status).json({
                    ok: false,
                    message: error.message,
                    status: error.status,
                    data: null
                })
            }
            console.error(error)
            return response.send({
                message: 'Error interno del servidor',
                status: 500,
                of: false,
                data: null
            })
        }
    }

    async addMemberRequest(request, response) {
        try {
            const { email, role } = request.body
            const { workspace } = request
            const user_to_invite = await userRepository.buscarPorEmail(email)
            if (!user_to_invite) {
                throw new ServerError('El mail del invitado no existe', 404)
            }

            const already_member = await workspaceRepository.getMembersByWorkspaceIdAndUserId(workspace._id, user_to_invite._id)

            if (already_member) {
                throw new ServerError('El usuario ya pertenece a este espacio de trabajo', 400)
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
                    subject: `Has sido invitado a ${workspace.title}`,
                    html: `
                    <h1>Has sido invitado a participar en el espacio de trabajo: ${workspace.title}</h1>
                    <p> Si no reconoces esta invitacion, desestima este mail </p>
                    <p>Da click en 'Aceptar invitacion' para aceptar la invitacion</p>
                    <a href="${ENVIRONMENT.URL_BACKEND}/api/workspace/${workspace._id}/members/accept-invitation?invitation_token=${token}">Aceptar invitacion</a>
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

        catch (error) {
            if (error.status) {
                return response.status(error.status).json({
                    ok: false,
                    message: error.message,
                    status: error.status,
                    data: null
                })
            }
            console.error(error)
            return response.send({
                message: 'Error interno del servidor',
                status: 500,
                of: false,
                data: null
            })
        }
    }

    async acceptInvitation(request, response) {
        try {
            const { invitation_token } = request.query
            const payload = jwt.verify(invitation_token, ENVIRONMENT.JWT_SECRET)
            const { id, workspace: workspace_id, role } = payload
            await workspaceRepository.addMember(id, workspace_id, role)
            response.redirect(`${ENVIRONMENT.URL_FRONTEND}/`)
        }

        catch (error) {
            if (error.status) {
                return response.status(error.status).json({
                    ok: false,
                    message: error.message,
                    status: error.status,
                    data: null
                })
            }
            console.error(error)
            return response.send({
                message: 'Error interno del servidor',
                status: 500,
                of: false,
                data: null
            })
        }
    }
    async getById(request, response) {
        try {
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
        catch (error) {
            if (error.status) {
                return response.status(error.status).json({
                    ok: false,
                    message: error.message,
                    status: error.status,
                    data: null
                })
            }
            console.error(error)
            return response.send({
                message: 'Error interno del servidor',
                status: 500,
                of: false,
                data: null
            })
        }
    }
}
const workspaceController = new WorkspaceController()

export default workspaceController