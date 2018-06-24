// Model
const User = require('../models/user');

module.exports = class Controller {
    /**
     * Controller constructor
     */
    constructor() {

        // add your models reference to controller.model
        this.model = { User }
    }

    /**
     * show validation errors in response
     *
     * @param req
     * @param res
     * @param callback
     * @return {boolean}
     */
    showValidationErrors(req , res , callback) {
        let errors = req.validationErrors();
        if(errors) {
            res.status(422).json({
                message : errors.map(error => {
                    return {
                        'field' : error.param,
                        'message' : error.msg
                    }
                }),
                success : false
            });
            return true;
        }
        return false
    }


    /**
     * escape and trim items of request params
     *
     * @param req
     * @param items
     */
    escapeAndTrim(req , items) {
        items.split(' ').forEach(item => {
            req.sanitize(item).escape();
            req.sanitize(item).trim();
        });
    }
}