const jwt = require('jsonwebtoken')

module.exports = (req, res, next)=>{
    try {
        const authToken = req.headers.authorization.split(' ')[1]
        const verifiedToken = jwt.verify(authToken, process.env.SECRET_KEY)
        req.body.userId = verifiedToken.userId
        next()
    } catch (error) {
        res.send({
            message: error.message,
            success: false
        })
    }
}