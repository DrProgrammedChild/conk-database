//Made by _programmeKid

//Variables
var commandutil = require("./Util/commands.js");
var discord = require("discord.js");
var client = new discord.Client();
var token = process.env.token;

//Events
client.on("ready",() => {
	client.user.setActivity("hacking you, m8");
	console.log("Client ready");
});

client.on("message",msg => {
	commandutil.execute(client,msg);
});

//Login
client.login(token);