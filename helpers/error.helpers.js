// creamos una clase ServerError, que proviene de un error de JavaScript, pero que ademas se agregue el status

class ServerError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

export default ServerError