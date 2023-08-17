const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    food_name:{
        type:String,
        required:true,
    },
    Ingredients:{
        type:String,
        required:true,
    },
    Category:{
        type:String,
        required:true,
    },
    Description:{
        type:String,
        required:true,
    },
    Price:{
        type:Number,
        required:true,
    },
    // Image:{
    //     type:String,
    //     required:false,
    // }
});

module.exports = mongoose.model('Product', UserSchema);