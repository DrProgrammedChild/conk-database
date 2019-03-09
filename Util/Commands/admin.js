//Variables
var Command = require("./command.js");
var database = require("./database.js");
var commands = [];

//Commands
commands.push(
	new Command(
		"kick",
		{
			roles: [
				"543711264807976970",
				"543711266963718145",
				"543711268801085442"
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
				"543711264807976970",
				"543711266963718145",
				"543711268801085442"
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
				"543711264807976970"
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
				"543711264807976970",
				"543711266963718145",
				"543711268801085442"
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
				"543711264807976970"
			]
		},
		function(client,msg,code){
			let retval = eval(msg.content.split(" ").slice(1).join(" "));
			msg.channel.send("**>**" + retval)
		},
		"Runs code"
	)
);

commands.push(
	new Command(
		"addcoins",
		{
			roles: [
				"543711264807976970",
				"543711266963718145",
				"543711268801085442"
			]
		},
		function(client,msg,user,amount){
			if(msg.mentions.members.first()){
				if(amount){
					database.getUser(msg.mentions.members.first())
						.then(usr => {
							if(parseInt(amount)){
								usr.addCoins(parseInt(amount));
								msg.channel.send("Gave **" + msg.mentions.members.first().user.username + "** **" + amount + "** hacker coins.");
							} else{
								msg.channel.send(":no_entry_sign: Error: Please provide a valid amount");
							}
						})
						.catch(console.log);
				} else{
					msg.channel.send(":no_entry_sign: Error: Please provide a valid amount");
				}
			} else{
				msg.channel.send(":no_entry_sign: Error: Please provide a valid user");
			}
		},
		"Gives a user coins"
	)
);

commands.push(
	new Command(
		"takecoins",
		{
			roles: [
				"543711264807976970",
				"543711266963718145",
				"543711268801085442"
			]
		},
		function(client,msg,user,amount){
			if(msg.mentions.members.first()){
				if(amount){
					database.getUser(msg.mentions.members.first())
						.then(usr => {
							if(parseInt(amount)){
								usr.takeCoins(parseInt(amount));
								msg.channel.send("Took **" + amount + "** hacker coins from **" + msg.mentions.members.first().user.username + "**.");
							}
						})
						.catch(console.log);
				} else{
					msg.channel.send(":no_entry_sign: Error: Please provide a valid amount");
				}
			} else{
				msg.channel.send(":no_entry_sign: Error: Please provide a valid user");
			}
		},
		"Takes coins from a user"
	)
);

//Export
module.exports = {
	name: "Admin",
	hidden: false,
	commands: commands
};