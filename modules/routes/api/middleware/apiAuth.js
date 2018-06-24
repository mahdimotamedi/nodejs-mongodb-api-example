const jwt = require('jsonwebtoken');
const User = require('../../../models/user');

module.exports = (req , res , next) =>  {
    let token = req.headers['x-access-token'] || req.body.token || req.query.token;

    if(token) {
        return jwt.verify(token , config.secret , (err , decode ) => {
            if(err) {
                return res.status(403).json({
                    success : false ,
                    data : 'Error in auth. Please login again'
                })
            } 
            
            User.findById(decode.user_id , (err , user) => {
                if(err) throw err;

                if(user) {
                    user.token = token;
                    req.user = user;
                    next();
                } else {
                    return res.status(403).json({
                        success : false ,
                        data : 'Error in auth. Please login again'
                    });
                }
            }) 

            // next();
            // return;
        })
    }

    return res.status(403).json({
        data : 'Not token provided',
        success : false
    })
}