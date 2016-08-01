var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy; // pasport local for simple logins
var CivilUser=require('../civil_models/user');
// serailization and deserialsation


//save user by its key say id in a session
passport.serializeUser(function(user,done)
{
    done(null,user._id); 
    //done callback
    //first parameter - means error , second parameter - saves to session req.session.passport.user = {id:'..
});

// get the user from session from its id
passport.deserializeUser(function(id,done)
{
    CivilUser.findById(id,function(err,user)
    {
        done(err,user);

        //after this we can have user with  req.user
    });
});


// Middleware for authentification

passport.use('MyLocalLogin',new LocalStrategy({
    //deifne parameters for username and password fields
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
} , // callback function  having req, email ,password and done callback
    function(req,email,password,done)
    {
        /// here email and password are typed in by user
        CivilUser.findOne({email:email},function(err,user)
        {
            if(err) return done(err);

            //user not found
            if(!user)
            {   console.log("User not there");
                return done(null,false,req.flash("loginMessage","No such user"));
                
            }


            if(!user.comparePasswords(password))
            {
                console.log("Password wrong");
              return   done(null,false,req.flash("loginMessage","Password wrong"));
            }

            console.log("Correct login");
            return done(null,user);  // when we reach here we have successRedirect while using this middleware


        });
    } 

));


// validation of authentication

exports.isAuthenticated=function(req,res,next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect('/login');
}


