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
	commandutil.init(client);
});

client.on("message",msg => {
	commandutil.execute(client,msg);
});

client.on("guildMemberAdd",member => {
	msg.channel.send("Welcome, **" + member.user.username + "**. Please read #important for important shit and #rules for more important shit. I'm just kidding, there are no rules :D");
});

client.on("guildMemberRemove",member => {
	msg.channel.send("Bye, **" + member.user.username + "**. I'll miss you :sob:.");
});

//Login
client.login(token);