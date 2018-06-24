const path = require('path');

module.exports = {
    port : 8081,
    webUrl : "http://localhost:8081/",
    paginateLimit: 6,
    secret : 'czxcVs@afdas@%#TETTY23123U#)^U!@)423',
    path : {
        root: path.resolve('./'),
        controllers : { 
            api : path.resolve('./modules/controllers/api'),
            web : path.resolve('./modules/controllers/web')
        },
        model : path.resolve('./modules/models'),
        transform : path.resolve('./modules/transforms'),
        controller : path.resolve('./modules/controllers'),
    },
    userTypes: {
        normal: 1,
        special: 2,
        admin: 3,
    },
    token: {
        expireTime: 396000, // seconds
    },
    verifyCode: {
        email: {
            resendTime: 30, // seconds
            expireTime: 7000, // seconds
        },
    },
}