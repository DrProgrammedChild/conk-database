//Variables
var Command = require("./command.js");
var request = require("request");
var commands = [];

//Commands
commands.push(
	new Command(
		"meme",
		function(client,msg){
			request("https://www.reddit.com/r/dankmemes/new.json?sort=new",(err,res,body) => {
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
		"Gives you some dank memes"
	)
);

commands.push(
	new Command(
		"gocommitdie",
		function(client,msg){
			request("https://www.reddit.com/r/gocommitdie/new.json?sort=new",(err,res,body) => {
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
		"OOF"
	)
);

//Export
module.exports = {
	name: "Fun",
	hidden: false,
	commands: commands
};