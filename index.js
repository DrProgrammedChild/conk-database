//Made by _programmeKid

//Variables
var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var dbjson = require("./database.json");
var app = express();
var dbpass = process.env.dbpass;

//Functions
function DBGetUser(user){
	let dbentry = dbjson["id-" + user.id];
	if(!dbentry){
		dbentry = {
			name: user.name,
			id: user.id,
			coins: 10
		};
		dbjson["id-" + user.id] = dbentry
		fs.writeFile(
			"./database.json",
			JSON.stringify(dbjson),
			console.log
		);
	}
	return dbentry;
}

function DBSetUser(user,newentry){
	dbjson["id-" + user.id] = newentry;
	fs.writeFile("./database.json",JSON.stringify(dbjson),console.log);
}

//Express routes
var urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(express.static("client"));

app.get("/",(req,res) => {
	res.sendFile("./client/index.html");
});

app.post("/db",urlencodedParser,(req,res) => {
	let cmd = req.body.command;
	let args = req.body.args;
	let auth = req.body.auth;
	if(auth == dbpass){
		if(cmd == "getuser"){
			res.end(JSON.stringify(args.user));
		} else if(cmd == "setuser"){
			DBSetUser(args.user,args.newentry);
			res.end("Success");
		}
	}
});

//Listen
app.listen(process.env.PORT || 8081);
console.log("Listening on port " + (process.env.PORT || 8081));