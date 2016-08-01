var router=require('express').Router();
var CivilCategory=require('../civil_models/category');

router.post('/add-category',function(req,res,next)
{
    var category=new CivilCategory();
    category.name=req.body.name;

    CivilCategory.findOne({name:req.body.name},function(err,existingCategory)
    {
        if(err) return next(err);

        if(existingCategory)
        {
            res.json("Category already exists");
        }
        else{
            category.save();

            res.json("Category added");
        }
    }); 
}); 

module.exports=router;