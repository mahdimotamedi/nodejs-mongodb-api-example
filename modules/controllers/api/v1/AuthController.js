const Controller = require('../../Controller');
const UserTransform = require('../../../transforms/v1/UserTransform');
const bcrypt = require('bcrypt');
const uniqid = require('uniqid');
const emailSender = require('../../../libraries/sendEmail');
const utilities = require('../../../libraries/Utility');

module.exports = new class AuthController extends Controller {
    /**
     * register new user
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async register(req, res) {
        let nowTimestamp = utilities.getNowTimeStamp();

        req.checkBody('firstName', 'First Name required').notEmpty();
        req.checkBody('lastName', 'Last Name required').notEmpty();

        req.checkBody('email', 'Email required').notEmpty();
        req.checkBody('email', 'Email invalid').isEmail();

        req.checkBody('password', 'Password required').notEmpty();
        req.checkBody('password', 'Min length of password is 5 chars').isLength({min: 5});

        if (this.showValidationErrors(req, res))
            return;

        this.verifyCodeEmail = uniqid();

        req.body.password = await bcrypt.hash(req.body.password, 10);

        this.model.User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            emailVerify: {
                status: false,
                code: this.verifyCodeEmail,
                sendTime: nowTimestamp,
            },
        }).save(err => {
            if (err) {
                console.log(err);
                if (err.code === 11000) {
                    return res.status(422).json({
                        data: 'Email is duplicated',
                        success: false
                    })
                } else {
                    throw err;
                }
            }

            return res.json({
                data: 'register successful',
                success: true
            });
        })
    }

    /**
     * login and get access token
     * @param req
     * @param res
     */
    login(req, res) {
        req.checkBody('username', 'Username Required').notEmpty();
        req.checkBody('password', 'Password Required').notEmpty();

        if (this.showValidationErrors(req, res))
            return;

        this.model.User.findOne({'email': req.body.username} , (err, user) => {
            if (err) throw err;

            if (user == null)
                return res.status(422).json({
                    data: 'Username is incorrect',
                    success: false
                });

            bcrypt.compare(req.body.password, user.password, (err, status) => {

                if (!status)
                    return res.status(422).json({
                        success: false,
                        data: 'Password is incorrect'
                    });

                return res.json({
                    data: new UserTransform().transform(user, true),
                    success: true
                });
            })
        })

    }

    /**
     * sent verify email to email user
     * @param req
     * @param res
     * @returns {*}
     */
    sentVerifyEmail(req, res) {

        if (req.user.emailVerify.status === true)
            return res.status(422).json({
                success: false,
                data: 'Email already verified'
            });

        emailSender.sent('info@pinshow.ir', req.user.email,
            'Confirmation email',
            `confirm link: <br>${config.webUrl}verify-email-address?email=${req.user.email}&code=${req.user.emailVerify.code}`,
            (err, info) => {
                if (err) {
                    return res.status(500).json({
                        data: 'Some problem in send',
                        success: true,
                    });
                }

                return res.json({
                    data: 'email sended',
                    success: true,
                });
            });
    }

    /**
     * verify email with sms code
     * @param req
     * @param res
     */
    verifyEmail(req, res) {

        req.checkQuery('email', 'Email required').notEmpty();
        req.checkQuery('email', 'Email invalid').isEmail();

        req.checkQuery('code', 'Code required').notEmpty();

        if (this.showValidationErrors(req, res))
            return;

        this.model.User.findOne({'email': req.query.email}, (err, user) => {
            if (user == null || err)
                return res.status(422).json({
                    data: 'This email not registered',
                    success: false,
                });

            if (user.emailVerify.status === true)
                return res.status(422).json({
                    data: 'Email already send',
                    success: false,
                });

            if (req.query.code !== user.emailVerify.code)
                return res.status(422).json({
                    data: 'Invalid Code',
                    success: false,
                });

            this.model.User.findByIdAndUpdate(user._id,
                {
                    'emailVerify.status': true
                },
                (err, user) => {
                    return res.json({
                        data: 'Email successfully confirmed',
                        success: true,
                    });
                });
        });
    }

    /**
     * request for forgotten password
     * @param req
     * @param res
     */
    newPasswordRequest(req, res) {

        req.checkBody('username', 'Username required').notEmpty();

        if (this.showValidationErrors(req, res))
            return;

        this.model.User.findOne({'email': req.body.username}, (err, user) => {
            if (err) throw err;

            if (user == null)
                return res.status(422).json({
                    data: 'Email not founded',
                    success: false
                });

            this.verifyCode = uniqid();
            this.model.User.findByIdAndUpdate(user._id,
                {
                    forgotPasswordRequest: {
                        code: this.verifyCode,
                        sendTime: utilities.getNowTimeStamp(),
                    }
                },
                (err, user) => {

                    // you need to make 'change-password' route to change password web page in this email
                    // please make it handy
                    emailSender.sent('info@pinshow.ir', user.email,
                        'Confirmation email',
                        `Password change link: <br>${config.webUrl}change-password?email=${user.email}&code=${user.forgotPasswordRequest.code}`,
                        (err, info) => {
                            if (err) {
                                return res.status(500).json({
                                    data: 'Some Problem in send email',
                                    success: true,
                                });
                            }

                            return res.json({
                                data: 'change password link send',
                                success: true,
                            });
                        });
                });
        });
    }

    /**
     * set new password for forgotten password
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async setNewPasswordInsteadOfOldOne(req, res) {
        req.checkBody('email', 'Email required').notEmpty();
        req.checkBody('email', 'Email invalid').isEmail();

        req.checkBody('code', 'Code required').notEmpty();
        req.checkBody('password', 'Password required').notEmpty();
        req.checkBody('password', 'Min length of password is 5 chars').isLength({min: 5});

        if (this.showValidationErrors(req, res))
            return;

        req.body.password = await bcrypt.hash(req.body.password, 10);

        this.model.User.findOne({'email': req.body.email},
            (err, user) => {
                if (err) throw err;

                if (user == null)
                    return res.status(422).json({
                        data: 'ٍEmail not founded',
                        success: false
                    });

                if (user.forgotPasswordRequest === {})
                    return res.status(422).json({
                        data: 'Invalid code. please send a new change request',
                        success: false
                    });

                if (user.forgotPasswordRequest.sendTime < (utilities.getNowTimeStamp() - config.verifyCode.email.expireTime))
                    return res.status(422).json({
                        data: 'Invalid code. please send a new change request',
                        success: false
                    });

                if (user.forgotPasswordRequest.code !== req.body.code)
                    return res.status(422).json({
                        data: 'Invalid code. please send a new change request',
                        success: false
                    });

                this.model.User.findByIdAndUpdate(user.id,
                    {
                        password: req.body.password,
                        forgotPasswordRequest: {}
                    },
                    (err, user) => {
                        res.json({
                            data: 'Password successfully change',
                            success: true
                        });
                    });
            });
    }
};