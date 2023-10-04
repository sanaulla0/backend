const Mongoose = require('mongoose');
 
const Schema = Mongoose.Schema;

const UserSchema = new Schema(
 {
    
   name:{
           type : String,
           require : true,
   },
   username:{
         type: String,
          require : true,
          unique : true,
   },
    email:{
        type: String,
        require : true,
        unique:true,
    },
    password:{
      type:String,
      require: true,
    },
              
},

         {
           strict : false,
         },
); 


module.exports = Mongoose.model("users",UserSchema);