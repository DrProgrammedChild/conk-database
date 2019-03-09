//Variables
var Command = require("./command.js");
var commands = [];
var database = require("./database.js");

//Classes
class ShopItem{
	constructor(options){
		this.name = options.name;
		this.price = options.price;
		this.description = options.description;
		this.role = options.role;
	}
	buy(member){
		database.getUser(member)
			.then(user => {
				if(user.coins >= this.price){
					member.addRole(this.role);
					user.takeCoins(this.price);
				}
			})
			.catch(console.log);
	}
}

//Shop
var shop = [
	new ShopItem({
		name: "Programmer",
		price: 100,
		description: "For those who have skills in over 2 programming languages, but are unable to hack.",
		role: "521053986636169239"
	}),
	new ShopItem({
		name: "Hacker",
		price: 200,
		description: "For those who are programmers that have the ability to hack.",
		role: "521053959008419860"
	}),
	new ShopItem({
		name: "Trusted Programmer",
		price: 300,
		description: "For the programmers who we trust most.",
		role: "521053805928775681"
	}),
	new ShopItem({
		name: "Trusted Hacker",
		price: 400,
		description: "For the hackers who we trust most.",
		role: "521053427221135360"
	})
];

//Commands
commands.push(
	new Command(
		"coins",
		function(client,msg,user){
			if(user){
				database.getUser(msg.mentions.members.first())
					.then(usr => {
						msg.channel.send("**" + msg.mentions.members.first().user.username + "** has **" + usr.coins + "** hacker coins.");
					})
					.catch(console.log);
			} else{
				database.getUser(msg.member)
					.then(usr => {
						msg.channel.send("You have **" + usr.coins + "** hacker coins.");
					})
					.catch(console.log);
			}
		},
		"Displays the amout of hacker coins you (or anyone else) has"
	)
);

commands.push(
	new Command(
		"shop",
		function(client,msg){
			let embed = {};
			embed.title = "Shop";
			embed.fields = [];
			for(let i = 0; i < shop.length; i++){
				let item = shop[i];
				embed.fields.push({
					name: (i+1) + ") " + item.name,
					value: "**Price:** " + item.price + "\n**Description:** " + item.description
				});
			}
			embed.footer = {
				text: "Do " + process.env.prefix + "buy <shopnumber> to buy an item."
			};
			msg.author.send({embed: embed});
			msg.channel.send("DM'd you a list of buyable items.")
		},
		"DM's you a list of buyable items"
	)
);

commands.push(
	new Command(
		"buy",
		function(client,msg,shopnumber){
			database.getUser(msg.member)
				.then(user => {
					let item = shop[parseInt(shopnumber)-1];
					if(item){
						if(user.coins >= item.price){
							item.buy(msg.member);
							msg.channel.send("Bought **" + item.name + "** for **" + item.price + "** hacker coins.");
						} else{
							msg.channel.send(":no_entry_sign: Error: Insufficient funds");
						}
					} else{
						msg.channel.send(":no_entry_sign: Error: Please enter a valid shop item")
					}
				})
				.catch(console.log);
		},
		"Displays the amout of hacker coins you (or anyone else) has"
	)
);

//Export
module.exports = {
	name: "Currency",
	hidden: false,
	commands: commands
};