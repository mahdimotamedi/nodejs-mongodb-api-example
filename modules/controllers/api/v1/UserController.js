const Controller = require('../../Controller');
const UserTransform = require('../../../transforms/v1/UserTransform');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require("path");

module.exports = new class UserController extends Controller {
    /**
     * get user info
     * @param req
     * @param res
     * @returns {*}
     */
    index(req, res) {
        return res.json({
            data: new UserTransform().transform(req.user),
            success: true
        })
    }

    /**
     * edit user settings
     *
     * @param req
     * @param res
     */
    edit(req, res) {
        req.checkBody('firstName', 'First Name required').notEmpty();
        req.checkBody('lastName', 'Last Name required').notEmpty();

        if (this.showValidationErrors(req, res))
            return;

        this.model.User.findByIdAndUpdate(req.user.id,
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            },
            (err, user) => {
                res.json({
                    update: 'success',
                    success: true
                });
            });
    }

    /**
     * change user password inside account
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async changePassword(req, res) {
        req.checkBody('oldPassword', 'Old Password required').notEmpty();

        req.checkBody('password', 'Password required').notEmpty();
        req.checkBody('password', 'Min length of password is 5 chars').isLength({min: 5});

        if (this.showValidationErrors(req, res))
            return;

        req.body.password = await bcrypt.hash(req.body.password, 10);

        bcrypt.compare(req.body.oldPassword, req.user.password, (err, status) => {

            if (!status)
                return res.status(422).json({
                    success: false,
                    data: 'Old password wrong'
                });

            this.model.User.findByIdAndUpdate(req.user.id,
                {
                    password: req.body.password,
                },
                (err, user) => {
                    res.json({
                        update: 'success',
                        success: true
                    });
                });
        });
    }

    /**
     * upload or select avatar of user
     *
     * @param req
     * @param res
     */
    uploadAvatar(req, res) {

        if (!req.file)
            return res.status(422).json({
                field: 'avatar',
                message: 'Image not uploaded correctly',
                success: false
            });

        if (req.user.avatar && req.user.avatar.indexOf('uploads') !== -1)
            fs.unlink(path.join(config.path.root, req.user.avatar), () => {

                req.file.path = req.file.path.replace(/\\/g, '/');
                req.user.avatar = req.file.path;
                req.user.save((err) => {

                    return res.json({
                        message: 'user profile changed correctly',
                        data: {
                            imagePath: config.webUrl + req.file.path
                        },
                        success: true
                    });
                });
            });
        else {
            req.file.path = req.file.path.replace(/\\/g, '/');
            req.user.avatar = req.file.path;
            req.user.save((err) => {

                return res.json({
                    message: 'user profile changed correctly',
                    data: {
                        imagePath: config.webUrl + req.file.path
                    },
                    success: true
                });
            });
        }
    }
};