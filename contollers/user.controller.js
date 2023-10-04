const User = require('../modules/User');
 const bcrypt = require('bcrypt');

const {VerifyUsernameAndEmailExists} = require("../utils/VerifyEmailandUsername"); 

const BCRYPT_SALT = parseInt(process.env.BCRYPT_SALT);
const isAuth = require('../middleware/AuthMiddleware');  
const session = require('express-session');
const Joi = require('joi');
 
const registerUser = async (req,res)=>{ 

     const isValid = Joi.object({
               name:Joi.string().required(),
               username:Joi.string().min(3).max(30).required(),
               password:Joi.string().min(8).required(),
               email:Joi.string().email().required(),
     }).validate(req.body);
     if(isValid.err){
    return  res.send({
           status:400,
           message:"invalid input",
           date : isValid.error,
       });
     }

     const usernameEmailVerify = await VerifyUsernameAndEmailExists(
        req.body.email,
        req.body.username
     );
       
     if (usernameEmailVerify === "E") {
      res.status(400).send({
        status: 400,
        message: "Email already exists!",
      });
      return; 
    } else if (usernameEmailVerify === "U") {
      res.status(400).send({
        status: 400,
        message: "Username already exists!",
      });
      return;
    } else if (usernameEmailVerify === "Err") {
      res.status(400).send({
        status: 400,
        message: "DB Error: Couldn't register user!",
      });
      return;
    }


       const hashedPassword = await bcrypt.hash(req.body.password, BCRYPT_SALT);

        const userObj = new User({
              name: req.body.name,
              username: req.body.username,
              email: req.body.email,
              password: hashedPassword,
        });
        try{
              userObj.save();
              res.send({
                  status:201,
                   message: "User created successfully!",
              });
        } catch(err) {
                 res.send({
                     status:400,
                     message: "DB Error: User creation failed",
                     data: err,
                 });
                }
};

const loginuser = async (req,res)=>{
  const {loginId ,password} = req.body;
  
  let dataUser;
  const isValid = Joi.object({
       loginId : Joi.string().email().required(),
  
}).validate(loginId);


try{
  
if(isValid.error){
           
        dataUser = await User.findOne({username : loginId});
}
else{
        dataUser = await User.findOne({email : loginId});
}
            console.log(dataUser);
         if(!dataUser){
          return  res.status(400).json("user id is not matched!");
         }
   
//updating the express session store
          req.session.isAuth = true;

          req.session.user = {
                 username : dataUser.username,
                  email : dataUser.email,
                  userId : dataUser._id,

          };

         const isPassword =   bcrypt.compare(password,dataUser.password);
 
         if(isPassword){
          return  res.status(200).send({  
               status : 200,
               message : "successfully logedin!",
               data : req.session.user
            });
         }else{
           return res.status(400).send({
                   status : 400,
                   message : "incorrect password",
           });
         }

}catch(err){
            res.status(400).send({
                 status : 400,
                 message : "DB Error!",
                 data :  err, 
            });  
}

}
 
const logoutUser = (req,res)=>{
             req.session.destroy((err)=>{
                    if(err) {
                         return res.send({
                               status : 400,
                               message : "logout unsuccessful!"
                         })
                    }
                    else{
                          return res.status(200).send({
                                status : 200,
                                 message : "Logout successfull!",
                          })
                    }
             })
}

const getAllUsers = async (req,res)=>{
   
  const userId =  req.params.userid;
  try{
       const allUser = await User.find({ _id : { $ne: userId } });      
        let userData = [];   
               
        allUser.map((item)=>{ 
                 let userdata = {
                      name : item.name,
                      username : item.username,
                      email : item.email,
                      _id : item._id,
                 };
                  userData.push(userdata); 
                //  console.log("data:",userData);
        });
         
        res.status(200).send({
               status : 200,  
               message : "all users fetched successfully",
               data : userData,
              
        })  
        
  }
catch (err) {
  res.status(400).send({
    status: 400,
    message: `DB Error: Get all users!${err.message}`,   
         
  });
}  
  
  
 };


  
module.exports = { registerUser,loginuser ,logoutUser,getAllUsers };
