//Variables
var Command = require("./command.js");
var commands = [];

//Commands
commands.push(
	new Command(
		"ping",
		function(client,msg){
			msg.channel.send("Pong!");
		},
		"Pings discord"
	)
);

commands.push(
	new Command(
		"version",
		function(client,msg){
			msg.channel.send("Version v0.1.0 (Alpha)");
		},
		"Displays bot version"
	)
);

commands.push(
	new Command(
		"website",
		function(client,msg){
			msg.channel.send("https://programming-hacking.herokuapp.com/");
		},
		"Go to our website"
	)
);

//Export
module.exports = {
	name: "Basic",
	hidden: false,
	commands: commands
};