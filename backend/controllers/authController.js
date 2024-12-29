const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')


router.post('/signup', async (req, res)=>{
    try {
        const user = await User.findOne({email: req.body.email})
        if(user){
            return res.status(400).send({
                message: 'user already exists',
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        req.body.password = hashedPassword

        const newUser = new User(req.body)
        await newUser.save()
        res.status(201).send({
            message: 'user created',
            success: true
        })

    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        })
    }
})

router.post('/login', async (req, res)=>{
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user){
            return res.status(400).send({
                message: 'user doesnt exist',
                success: false
            })
        }
        const passwordIsValid = await bcrypt.compare(req.body.password, user.password)
        if(!passwordIsValid){
            return res.status(400).send({
                message: 'password is incorrect',
                success: false
            })
        }
        const authToken = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: "1d"})
        res.send({
            message: 'user logged in',
            success: true,
            token: authToken
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false
        })
    }
})

module.exports = router;