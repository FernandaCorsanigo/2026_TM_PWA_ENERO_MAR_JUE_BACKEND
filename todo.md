# Recomienda que hagamos por nuestra cuenta:
- PUT /:workspace_id => Actualizar espacio de trabajo
- DELETE /:workspace_id/members/:member_id => Borrar miembro
- PUT /:workspace_id/members/:member_id => Actualizar miembro (Cambiar rol)
- PUT /:workspace_id/channels/:channel_id => Actualizar canal (por ejemplo el name)
- DELETE /:workspace_id/channels/:channel_id/messages/:message_id => Eliminar mensaje (siempre que seas admin, owner o creador del mensaje)
- Flujo de olvide mi contrasena (pedir mail y enviar correo electronico con link para cambiar contrasena)
 Flujo de cambiar la contrasena (desde algun boton ella cuenta, hacer click y llevar al link para cambiar contrasena)

# Extras:
- 2Fa o 2 factor authentication (que haya mas de un factor al iniciar sesion o autentificar cierta accion)
 Ejemplo:
    - Te pido tu password y email, y si estan bien te envio un codigo de 6 digitos al mail (lo guardo en DB) y luego vos me envias este codigo.

# Estas son core y estaran en la clase
- GET /:workspace_id => Obtener espacio de trabajo (que traiga el espacio de trabajo al que vamos a estar accediendo)
    - Tiene que ser miembro.
    - Tiene que traer toda la info de cierto espacio de trabajo, incluyendo nuestra membresia con ellos (osea si soy owner, admin o miembro).
- GET /:workspace_id/channels => Obtener canales relacionados al espacio de trabajo
- POST /:workspace_id/channels => Crear canal
- Crear un middleware de canales, channelMiddleware
    - Verificar que x canal exista
    - Verificar que pertenezca a x espacio de trabajo
- GET /:workspace_id/channels/:channel_id/messages => Obtener mensajes relacionados al canal
- POST /:workspace_id/channels/:channel_id/messages => Crear mensaje