const Transform = require('./../Transform');
const jwt = require('jsonwebtoken');

module.exports = class UserTransform extends Transform {

    /**
     * transform user data to client response
     *
     * @param item
     * @param createToken
     * @return {{firstName: (firstName|{type, required}), lastName: (lastName|{type, required})}}
     */
    transform(item , createToken = false) {
        this.createToken = createToken;
        return {
            'firstName' : item.firstName,
            'lastName' : item.lastName,
            ...this.withToken(item)
        }
    }

    /**
     * this option provide token in response
     *
     * @param item
     * @return {*}
     */
    withToken(item) {
        if(item.token) 
            return {};

        if(this.createToken) {
         
            let token = jwt.sign({ user_id : item._id } , config.secret , {
                expiresIn :  config.token.expireTime + 's',
            });

            return { token }
        }

        return {};
    }

}