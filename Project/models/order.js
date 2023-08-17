const mongoose=require('mongoose');

const orderSchema=new mongoose.Schema({
    Name:{
        type:String,
        required:true,
    },
    Email:{
        type:String,
        required:true,
    },
    Phone_number:{
        type:String,
        required:true,
    },
    food_name:{
        type:String,
        required:true,
    },
    Quantity:{
        type:Number,
        required:true,
    },
    Price:{
        type:Number,
        required:true,
    },
    Description:{
        type:String,
        required:true,
    },
});

module.exports = mongoose.model('Order', orderSchema);