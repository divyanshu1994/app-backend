var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var QuestionSchema=new Schema({

    text:{type:String,lowercase:true},
    quesBy:{type:Schema.Types.ObjectId,ref:'CivilUser'},
    category:{type:Schema.Types.ObjectId,ref:'CivilCategory'},
    when:Date,
    answers:[
        {
        answer:{type:Schema.Types.ObjectId,ref:'Answer'}
    }
        ],

    votedBy:[{
        user:{type:Schema.Types.ObjectId,ref:'CivilUser'},
        value:Number
    }]
});

module.exports=mongoose.model("Question",QuestionSchema);