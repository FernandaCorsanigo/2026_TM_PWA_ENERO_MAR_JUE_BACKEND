class TestController{
    get (request, response) {
        response.send('test hecho')
    }
}

const testController = new TestController()
export default testController