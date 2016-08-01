var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var CategorySchema=new Schema({
    
    name:{type:String,lowercase:'true',unique:'true'}

});

module.exports=mongoose.model('CivilCategory',CategorySchema);