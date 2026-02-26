import ServerError from "../helpers/error.helpers.js"
import workspaceRepository from "../repository/workspace.repository.js"

function workspaceMiddleware(authorized_roles = []) {

    return async function (request, response, next) {
        try {
            const user_id = request.user.id
            const workspace_id = request.params.workspace_id

            const workspace_selected = await workspaceRepository.getById(workspace_id)

            if (!workspace_selected) {
                throw new ServerError('Espacio de trabajo no encontrado', 404)
            }

            const member_selected = await workspaceRepository.getMembersByWorkspaceIdAndUserId(workspace_id, user_id)

            if (!member_selected) {
                throw new ServerError('No perteneces a este espacio de trabajo', 403)
            }


            if (authorized_roles.length > 0 && !authorized_roles.includes(member_selected.role)) {
                throw new ServerError('No estas autorizado para hacer esta operacion', 403)
            }

            request.workspace = workspace_selected
            request.member = member_selected
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
}

export default workspaceMiddleware