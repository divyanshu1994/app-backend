var express=require('express');
var mongoose=require('mongoose');
var morgan=require('morgan');
var bodyParser=require('body-parser');
var ejs_mate=require('ejs-mate'); // for doing boilerplate like things
var urlencoded=bodyParser.urlencoded({extended:true});
var jsonParser=bodyParser.json();
var flash=require('express-flash'); // Note : flash require sessions
var session=require('express-session');
var cookieParser=require('cookie-parser');
var ConnectMongo=require('connect-mongo/es5')(session) ;  // use for storing session data in database 
var passport=require('passport');

//models



var app=express();

//import routs
var main_route=require('./civil_routes/main');
var user_route=require('./civil_routes/user');
var admin_route=require('./civil_routes/admin');



//config files
var config=require('./civil_config/config');

//middlewares

app.use(express.static(__dirname+"/public")); //static files
app.engine('ejs',ejs_mate);
app.set('view engine','ejs');
app.use(morgan('dev'));
app.use(urlencoded);
app.use(jsonParser);
app.use(flash());
app.use(cookieParser());
app.use(session({
  resave:true,
  saveUninitialized:true,  // save a new session whcih is not modified
  secret:config.secret,
  //define store for session
  store:new ConnectMongo({
    url:config.db_name,
    autoReconnect:true
  })
}));
app.use(passport.initialize()); // to use our middle ware
app.use(passport.session()); // to use serialisation and deserialization



//mongoose connect
mongoose.connect(config.db_name, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the database");
  }
});

app.use('/',main_route);
app.use('/user',user_route);
app.use('/admin',admin_route);

//listen to server
app.listen(config.port,function(err)
{
  console.log("Listening to port "+config.port);
});

