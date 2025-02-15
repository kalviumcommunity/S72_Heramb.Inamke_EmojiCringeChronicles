const express = require('express');
const app = express();
const mongoose=require('mongoose')
const routes=require('./routes')

require('dotenv').config()

app.use(express.json())
app.use('/api',routes)

app.get('/ping', (req, res) => {
    try{
        res. send('Pong!');
    }catch(error){
        next(error)
    }
});



const PORT = process.env.PORT || 3000;
if(!process.env.PORT) console.warn("PORT environment is not set. Using default port 3000")

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


const connectDatabase=()=>{
    mongoose.connect(process.env.MONGO_URL,{ssl:true})
    .then((data)=>{console.log('Databse is connected : ',data.connection.host)})
    .catch((err)=>console.log('Database connection failed ',err.message))
}

connectDatabase()