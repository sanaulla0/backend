const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;

const FollowSchema = new Schema ({
  
  followerUserId : {
             type : String,
             ref : "users",
             require : true,  
  },

  followingUserId : {
      type: String,
      ref : "users",
      require : true
  },
  creationDatetime : {
         type : Date,
         default : Date.now(),
         require : true

  },


});

module.exports = Mongoose.model("follow", FollowSchema);