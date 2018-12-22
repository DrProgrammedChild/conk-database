//Variables
var Command = require("./command.js");
var request = require("request");
var commands = [];

//Commands
commands.push(
	new Command(
		"hentai",
		function(client,msg){
			request("https://www.reddit.com/r/hentai/new.json?sort=new",(err,res,body) => {
				let json = JSON.parse(body);
				let posts = json.data.children;
				let post = posts[Math.floor(Math.random() * posts.length)];
				while(post == undefined){
					post = posts[Math.floor(Math.random() * posts.length)];
				}
				msg.channel.send({
					files: [
						post.data.url
					]
				});
			});
		},
		"Gives you some dank hentai"
	)
);

commands.push(
	new Command(
		"traphentai",
		function(client,msg){
			request("https://www.reddit.com/r/traphentai/new.json?sort=new",(err,res,body) => {
				let json = JSON.parse(body);
				let posts = json.data.children;
				let post = posts[Math.floor(Math.random() * posts.length)];
				while(post == undefined){
					post = posts[Math.floor(Math.random() * posts.length)];
				}
				msg.channel.send({
					files: [
						post.data.url
					]
				});
			});
		},
		"Traps ain't gay"
	)
);

//Export
module.exports = {
	name: "NSFW",
	hidden: false,
	commands: commands
};