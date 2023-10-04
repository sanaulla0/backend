const User = require('../modules/User');


const verifyUserId = async (userId) => {
 try {
   const userData = await User.findById(userId);

   if (userData) {
     return true;
   } else {
     return false;
   }
 } catch (err) {
   return "err";
 }
};

module.exports = { verifyUserId };