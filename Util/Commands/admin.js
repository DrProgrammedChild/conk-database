//Variables
var Command = require("./command.js");
var commands = [];

//Commands
commands.push(
	new Command(
		"kick",
		{
			roles: [
				"521053206500081684",
				"521053328835084290",
				"521053082801405952"
			]
		},
		function(client,msg,user){
			let member = msg.mentions.members.first()
			if(member){
				if(member.kickable){
					member.kick();
				} else{
					msg.channel.send(":no_entry_sign: Error: Unable to kick user");
				}
			} else{
				msg.channel.send(":no_entry_sign: Error: Please provide a valid user to kick")
			}
		},
		"Kicks a user"
	)
);

commands.push(
	new Command(
		"ban",
		{
			roles: [
				"521053206500081684",
				"521053328835084290",
				"521053082801405952"
			]
		},
		function(client,msg,user){
			let member = msg.mentions.members.first()
			if(member){
				if(member.bannable){
					member.ban();
				} else{
					msg.channel.send(":no_entry_sign: Error: Unable to ban user");
				}
			} else{
				msg.channel.send(":no_entry_sign: Error: Please provide a valid user to ban")
			}
		},
		"Kicks a user"
	)
);

commands.push(
	new Command(
		"kill",
		{
			roles: [
				"521053082801405952"
			]
		},
		function(client,msg){
			process.exit(0);
		},
		"Kills the bot"
	)
);

commands.push(
	new Command(
		"say",
		{
			roles: [
				"521053206500081684",
				"521053328835084290",
				"521053082801405952"
			]
		},
		function(client,msg,message){
			msg.channel.send(msg.content.split(" ").slice(1).join(" "));
			msg.delete();
		},
		"Says something"
	)
);

commands.push(
	new Command(
		"eval",
		{
			roles: [
				"521053082801405952"
			]
		},
		function(client,msg,code){
			let retval = eval(msg.content.split(" ").slice(1).join(" "));
			msg.channel.send("**>**" + retval)
		},
		"Runs code"
	)
);

//Export
module.exports = {
	name: "Admin",
	hidden: false,
	commands: commands
};