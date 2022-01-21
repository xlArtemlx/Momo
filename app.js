const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()

// app.use('/api/auth',require('./routes/user.routes'))
app.use(bodyParser.json());
const PORT = config.get('port') || 5000
// app.use('/api/auth',require('./routes/user.routes'))
app.use('/privat',require('./routes/testnet.routes'))

// async function start() {
//     try {
//         await mongoose.connect(config.get('mongoUri'),{
//             useNewUrlParser:true,
//             useUnifiedTopology:true,
//             useCreateIndex:true
//         })
//     }catch(e){
//         console.log("Serer error",e.message)
//         process.exit(1)
//     }
// }
// start()

app.listen(PORT,()=>{
    console.log('port 5000')
})