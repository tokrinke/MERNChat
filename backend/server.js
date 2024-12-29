const dotenv = require('dotenv')
dotenv.config({path: './.env'})
const dbconfig = require('./config/dbConfig')
const server = require('./index')

const port = process.env.PORT

server.listen(port, ()=>{
    console.log('listening to port: '+port)
})