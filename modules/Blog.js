
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const BlogSchema = new Schema(
 {

   title:{
         type : String,
          require : true,
   },

   textBody:{
             type: String,
             require: true,
   },

    creationDateTime:{
       type : Date,
       default: Date.now(),
        require : true,
    },
    userId:{
         type: Schema.Types.ObjectId,
          require : true,
    },
    isDeleted:{
       type: Boolean,
       default: false,
       require : true,
    },
    deletionDateTime: {
      type: Date,
      require: false,
    },

},
);

module.exports = Mongoose.model("blogs",BlogSchema);