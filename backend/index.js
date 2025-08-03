const express = require("express");
const dotenv = require('dotenv/config.js');
const cors = require('cors'); 
const connectDB = require("./configs/db.js");
const userRouter = require("./routes/userRoutes.js");
const ownerRouter = require('./routes/OwnerRoutes.js')
const bookingRouter = require('./routes/bookingRoutes.js')
const app = express();
connectDB()
//Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req,res) =>{
   res.send("server is running")
});

app.use('/api/user',userRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/booking', bookingRouter)

const PORT = process.env.PORT
app.listen(PORT, () =>{
   console.log(`SERVER IS RUNNING ON ${PORT}`);
    
})