const Session = require('../modules/Session');
const isAuth = (req,res,next)=> {
      
        next();
}

module.exports = {isAuth}; 