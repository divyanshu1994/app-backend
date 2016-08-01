//routes for main page , about ,products etc
var router=require('express').Router();
var Question=require('../civil_models/question');
var Answer=require('../civil_models/answer');
var async=require('async');
var CivilCategory=require('../civil_models/category')

router.get('/',function(req,res,next)
{
    res.json("Welcome to home page");
});

router.post('/add_ques',function(req,res,next)
{
    // api to add question
    var ques=new Question();
    ques.text=req.body.text;
    ques.quesBy=req.user._id;
      ques.when=new Date();
 

    CivilCategory.findOne({name:req.body.category},function(err,category)
    {
        
           ques.category=category._id;

           ques.save(function(err){
        if(err) return next(err);

        res.json("New Question Added");
    });

    });
  

    
});


router.get('/questions/:category',function(req,res,next)
{
    // api to get all questions of a category

 CivilCategory.findOne({name:req.params.category},function(err,category)
    {
        if(category)
        {
            Question.find({ category :category._id})
            .populate('category')
              .exec(function(err,questions)
              {
                if(err) return next(err);
                    res.json(questions);
                });
        }

        else{
 res.json("Invalid category");
        }

    });


   
});

router.get('/question/:id',function(req,res,next)
{
    //api to get question by its id 
    Question.findOne({_id:req.params.id})
    .populate('answers.answer')
    .populate('votedBy.user')
   
    .populate('quesBy')
    .exec(function(err,question)
    {        if(err) return next(err);

//since it was unable to populate answers.answer.ansBy , I have to do it here
// here it takes first param as populated question from earliar populations adn second
// param as path of ansBy ... in this case writing model is important
        Question .populate(question,{path:'answers.answer.ansBy',model:'CivilUser'},function(err,question){
            if(err) return next(err);
            res.json(question);
             
        });
          

    });
});


// api to answer a question havin ID as id
router.post('/question/:id/answer',function(req,res,next)
{
    
    var answer =new Answer();

    answer.text=req.body.text;
    answer.ansBy=req.user._id;
    answer.when=new Date();

    answer.save(function(err,answer)
    {
        if(err) return next(err);

        
    Question.update({_id:req.params.id},
    {
          $addToSet:  {
            answers:{
                answer:answer._id
            }
        }
    },
    
    function(err,question)
    {
        if(err) return next(err);

        // add answers to that question

        res.json(question);
    });

    });
});


//api for search a query
router.post('/search',function(req,res,next)
{
    var q=req.body.q;

    res.redirect('/search?q='+q);
});

router.get('/search',function(req,res,next)
{
    var query=req.query.q;

    Question.find({text:{$regex:query}})
    .populate('answers.answer')
    .exec(function(err,questions)
    {
        if(err) return next(err);

        res.json(questions);
    });
});


// api for upvoting or downvoting a question

router.get('/question/:id/update_vote/:vote_value',function(req,res,next)
{

async.waterfall([function(callback){
Question.findOne({
    _id:req.params.id,
   votedBy:{$elemMatch:{user:req.user._id}}  // array name : {match the element having same id}
},function(err,question)
{
    if(err) {console.log("Error");return next(err)};
var already_voted=false;
    if(question)
    {
     already_voted=true;
    
    }else{
        already_voted=false;
    }

    console.log("Already voted ? "+already_voted);
    callback(null,already_voted);
});

},

function(already_voted,callback)
{
    if(already_voted)
    {
        console.log("Already voted ");


        Question.update({
           _id:req.params.id,
         votedBy:{$elemMatch:{user:req.user._id}}
        
    },
            {
                $set:{"votedBy.$.value":req.params.vote_value}
            },
            function(err,question)
        {   

            res.json(question);
        });
    }
    else{
        console.log("first time vote");

        Question.update({_id:req.params.id},
    {
        
        $addToSet:{
            votedBy:{
                user:req.user._id,
                value:req.params.vote_value
            }
        }
    },function(err,updatedQues)
    {   
        if(err) return next(err);

        res.json(updatedQues);
    });

    }
}
]);


});


// api to get top questions
router.get('/top',function(req,res,next)
{
    Question.find().sort({"votedBy":-1}) // sort by array votedBy in descending order
    .populate('category')
  .populate('quesBy')
   . exec(function(err,questions)
    {
        if(err) return next(err);

        res.json(questions);
    });
});


// api to get top question in category
router.get('/top/:category',function(req,res,next)
{
     CivilCategory.findOne({name:req.params.category},function(err,category)
    {
        if(category)
        {
            Question.find({ category :category._id})
            .populate('category')
            .populate('quesBy')
            .sort({"votedBy":-1})
              .exec(function(err,questions)
              {
                if(err) return next(err);
                    res.json(questions);
                });
        }

        else{
 res.json("Invalid category");
        }

    });
});

module.exports=router;