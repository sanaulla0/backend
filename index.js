
const express = require('express');
require("dotenv").config();


const db = require('./config/db');
const routes = require('./routes/user');
const blogroutes = require('./routes/blog');
const followroutes = require('./routes/follow');
const session = require("express-session");
const MongoDbSession = require('connect-mongodb-session')(session);
const cors = require('cors');
const app = express();
 const {cleanUpBin} = require('./utils/cron');
//middle wares
app.use(express.json());
 
app.use(cors({
    origin : '*',
}));

const store = new MongoDbSession({
          uri : process.env.mongoose_url,
          collection : "sessions",
});

app.use(
       session({
           secret : process.env.SECRET_KEY,
           resave : false,
           saveUninitialized : false,
           store : store,

       })
);

app.use("/",routes);
app.use('/blog',blogroutes);
app.use('/follow',followroutes);
app.listen(process.env.PORT_SERVER, () => {
     console.log("server is running at port",process.env.PORT_SERVER);
 cleanUpBin();
})


 