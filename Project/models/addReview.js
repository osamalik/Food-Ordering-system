const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    food_review:{
        type:String,
        required:true,
    },
   food_rating:{
       type:Number,
       required:true,
   },
});

//const Review= mongoose.model('Review', UserSchema);

module.exports = mongoose.model('Review', UserSchema);