//Variables
var database = require("./Util/Commands/database.js");
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var request = require("request");
var app = express();

//Classes
class DiscordOAuth2{
	constructor(options){
		this.id = options.id;
		this.secret = options.secret;
		this.scope = options.scope;
		this.redir_uri = options.redir_uri;
		this.disclogin_uri = "https://discordapp.com/api/oauth2/authorize?client_id=" + this.id + "&redirect_uri=" + encodeURIComponent(this.redir_uri) + "&response_type=code&scope=" + this.scope;
	}
	getAccessToken(code){
		return new Promise((resolve,reject) => {
			let payload = "client_id=" + this.id + "&client_secret=" + this.secret + "&grant_type=authorization_code&code=" + code + "&redirect_uri=" + encodeURIComponent(this.redir_uri) + "&scope=" + this.scope;
			let options = {
				url: "https://discordapp.com/api/oauth2/token",
				body: payload,
				method: "POST",
				body: payload,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			};
			request(options,(err,res,body) => {
				let json = JSON.parse(body);
				resolve({
					token: json.access_token,
					expiration: json.expires_in
				});
			});
		});
	}
	getUser(token){
		return new Promise((resolve,reject) => {
			let options = {
				url: "https://discordapp.com/api/users/@me",
				method: "GET",
				headers: {
					"Authorization": "Bearer " + token
				}
			}
			request(options,(err,res,body) => {
				return JSON.parse(body);
			});
		});
	}
}

//Functions


//Oauth
var oauth = new DiscordOAuth2({
	id: process.env.clientid,
	secret: process.env.clientsecret,
	scope: "identify",
	redir_uri: "https://programming-hacking.herokuapp.com/oauth/discord/callback"
});

//Express routes
var jsonParser = bodyParser.json();
app.use(cookieParser());
app.use(bodyParser.json());
app.set("view engine","ejs");

app.get("/",(req,res) => {
	let loggedin;
	if(req.cookies.token){
		loggedin = true;
		oauth.getUser(req.cookies.token)
			.then(user => {
				database.getUser(user)
					.then(dbuser => {
						res.render("index.ejs",{
							loggedin: loggedin,
							user: user,
							dbuser: dbuser
						});
					})
					.catch(console.log);
			})
			.catch(console.log);
	} else{
		res.render("index.ejs",{
			loggedin: loggedin
		});
	}
});

app.get("/login",(req,res) => {
	res.redirect(oauth.disclogin_uri);
});

app.get("/oauth/discord/callback",(req,res) => {
	oauth.getAccessToken(req.query.code)
		.then(token => {
			res.cookie("token",token.token,{maxAge: parseInt(token.expiration)});
			res.redirect("/");
		})
		.catch(console.log);
});

//Listen
app.listen(process.env.PORT || 8081);
console.log("Listening on port " + (process.env.PORT || 8081));
