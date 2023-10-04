const mongoose = require('mongoose');


mongoose.connect(process.env.mongoose_url).then((res)=>{
                      console.log("Mongodb conected!");
})
.catch((err)=>{
    console.log(err);
});