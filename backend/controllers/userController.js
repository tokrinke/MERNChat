const router = require('express').Router()
const User = require('../models/user')
const authMiddleware = require('../middlewares/authMiddleware')
const cloudinary = require('../cloudinary')
const { response } = require('express')

router.get('/current', authMiddleware, async (req, res)=>{
    try {
        const user = await User.findOne({_id: req.body.userId})
        res.send({
            message: 'user fetched',
            success: true,
            data: user
        })
    } catch (error) {
        res.send({
            message: error.message,
            success: false
        })
    }
})

router.get('/all', authMiddleware, async (req, res)=>{
    try {
        const currentUserId = req.body.userId 
        const users = await User.find({_id: {$ne: currentUserId}})
        res.send({
            message: 'users fetched',
            success: true,
            data: users
        })
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        })
    }
})

router.post('/upload-pfp', authMiddleware, async (req, res)=>{
    try {
        const image = req.body.image

        const uploadedPfp = await cloudinary.uploader.upload(image, {
            folder: 'MERNChat'
        })
        console.log(uploadedPfp)

        const user = await User.findByIdAndUpdate(
            {_id: req.body.userId},
            {pfp: uploadedPfp.secure_url},
            {new: true}
        )

        res.send({
            response: 'Profile picture updated',
            success: true,
            data: user
        })
    } catch (error) {
        res.send({
            response: error.message,
            success: false
        })
    }
})

module.exports = router