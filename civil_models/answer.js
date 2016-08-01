var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var AnswerSchema=new Schema({

    text:{type:String},
    ansBy:{type:Schema.Types.ObjectId,ref:'CivilUser'},
    when:Date

});

module.exports=mongoose.model('Answer',AnswerSchema);