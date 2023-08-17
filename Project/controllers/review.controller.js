const { response } = require('express');
var Userdb = require('../models/addReview');

// create and insert review
exports.create = (req,res)=>{

    
    const review = new Userdb({
       food_review:req.body.food_review,
       food_rating:req.body.food_rating,
    });
    
    // save review in the database
    review
        .save(review)
        .then(data => {
            res.redirect('/reviews');

        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });

        const { food_review, food_rating} = req.body;
        let errors = [];

        if (!food_review || food_rating  ) {
        errors.push({ msg: "Please enter all fields" });
  }

}

exports.all=(req,res)=>{
    review=req.params.id;
    Userdb.find({reference:review},function(err,review){
        if(err){ 
        return res.status(400).json({err:"Something went wrong!"});
    }
    res.status(200).render("reviews",{user: req.user, review:review});
 });
};


