/*
*external imports
*/
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require("path");

/*
*internal imports
*/
const userRouter = require('./routes/users');
const postRouter = require('./routes/posts');
const categoryRouter = require('./routes/categories');
const authRouter = require('./routes/auth');

const app = express();
dotenv.config();

//database connection
mongoose.connect(process.env.MONGO_CONNECTION_STRING,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify: false
}).then(()=>{
    console.log('Database connected successfully');
}).catch((err)=>{
    console.log(err);
});

//processing request
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// set static folder
app.use(express.static(path.join(__dirname, "public")));


app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
   next();
});


//declaring api/route
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/post',postRouter);
app.use('/api/category',categoryRouter);

let port = process.env.PORT || 5000

//listening port/start the app
app.listen(port,()=>{
    console.log(`app listening on port ${port}`)
});
