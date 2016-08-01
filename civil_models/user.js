var mongoose=require('mongoose');
var Schema=mongoose.Schema;

// make blue print of user
var UserSchema=new Schema({

    profile:{
        name:String,
        pic:{type:String, default:''}
    },
    email:{type:String , unique:true ,lowercase:true},
    password:String,


});

// do password encrypting before saving to db

UserSchema.pre('save',function(next)
{
    var user=this;
    user.password="DSDSDSD "+user.password;

    next();
});

// compare password entered and password in db

UserSchema.methods.comparePasswords=function(password)
{
    if(this.password=="DSDSDSD "+password)
    {
        return true;
    }
    else{
        return false;
    }
}
module.exports=mongoose.model("CivilUser",UserSchema);