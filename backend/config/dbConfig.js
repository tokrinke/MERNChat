const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)

const db = mongoose.connection
db.on('connected', ()=>{
    console.log('successfully connected to the database.')
})
db.on('err', ()=>{
    console.log('error occured while trying to connect to the database.')
})

module.exports = db;