//npm imports for server
var express = require("express");
var bodyParser = require("body-parser");
//database
var mongoose = require("mongoose");

//mongoose models
var Article = require("./models/Article.js")(mongoose);
var Comment = require("./models/Comment.js")(mongoose);

//initialize app
var app = express();

var port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//************************************** connection needs to be dynamic by end
mongoose.connect("mongodb://localhost/wikidb");

var db = mongoose.connection;
//event listener fires iff the database connection fails...
db.on("error", err=>{
	console.error("ERROR MONGOOSE:" + err);
});
//... else database connection succeeeds and this event listener fires
db.once("open", ()=>{
	console.log("MONGOOSE SUCCESSFULLY CONNECTED");
});

/*following requires void function which take in an app, models, and sets routes*/
require("./controllers/api-router.js")(app, Article, Comment);

app.listen(port, function(){
	console.log("App running on " + port);
})

