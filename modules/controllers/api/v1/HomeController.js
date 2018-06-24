module.exports = new class HomeController {

    /**
     * index action
     *
     * @param req
     * @param res
     */
    index(req , res) {
        res.json('api is running correctly');
    }

    /**
     * version action
     *
     * @param req
     * @param res
     */
    version(req , res) {
        res.json('version 1.0.0')
    }
}