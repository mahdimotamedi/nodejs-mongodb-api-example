module.exports = (req , res , next) =>  {
    if(req.user.type === config.userTypes.admin) {
        next();
        return;
    }

    return res.status(403).json({
        message : 'You do not have access to this action',
        success : false
    })
}