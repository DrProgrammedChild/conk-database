//Variables
var Command = require("./command.js");
var ytdl = require("ytdl-core");
var request = require("request");
var youtubeinfo = require("youtube-info");
var youtubeid = require("get-youtube-id");
var commands = [];
var ytapikey = process.env.ytapikey;
var playing = false;
var queue = [];
var dispatcher;
var vc;

//Functions
function search(query){
	return new Promise((resolve,reject) => {
		request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + ytapikey,(err,res,body) => {
			let json = JSON.parse(body);
			resolve("https://www.youtube.com/watch?v=" + json.items[0].id.videoId);
		});
	});
}

function queueAdd(query,requester){
	return new Promise((resolve,reject) => {
		search(query)
			.then(url => {
				youtubeinfo(youtubeid(url),(err,info) => {
					let song = {
						name: info.title,
						url: url,
						requester: requester
					};
					queue.push(song);
					resolve(song);
				});
			})
			.catch(console.log);
	});
}

function play(song,channel,tc){
	channel.join()
		.then(con => {
			vc = channel;
			let stream = ytdl(song.url,{filter: "audioonly"});
			dispatcher = con.playStream(stream);
			playing = true;
			tc.send("Playing **" + song.name + "** (requested by **" + song.requester + "**).");
			dispatcher.on("end",() => {
				playing = false;
				dispatcher = undefined;
				queue.shift();
				if(queue[0]){
					play(queue[0],channel,tc);
				} else{
					channel.leave();
					vc = undefined;
				}
			});
		})
		.catch(console.log);
}

//Commands
commands.push(
	new Command(
		"play",
		function(client,msg,song){
			song = msg.content.split(" ").slice(1).join(" ");
			if(playing){
				queueAdd(song,msg.author.username)
					.then(rsong => {
						msg.channel.send("Added **" + rsong.name + "** to queue.");
					})
					.catch(console.log);
			} else{
				if(msg.member.voiceChannel){
					queueAdd(song,msg.author.username)
						.then(rsong => {
							play(queue[0],msg.member.voiceChannel,msg.channel)
						})
						.catch(console.log);
				} else{
					msg.channel.send(":no_entry_sign: Error: Not connected to voice channel")
				}
			}
		},
		"Plays a song"
	)
);

commands.push(
	new Command(
		"pause",
		function(client,msg){
			if(dispatcher){
				if(playing){
					playing = false;
					dispatcher.pause()
				} else{
					msg.channel.send(":no_entry_sign: Error: Song already paused");
				}
			} else{
				msg.channel.send(":no_entry_sign: Error: Nothing is playing");
			}
		},
		"Pauses a song"
	)
);

commands.push(
	new Command(
		"resume",
		function(client,msg){
			if(dispatcher){
				if(!playing){
					playing = true;
					dispatcher.resume()
				} else{
					msg.channel.send(":no_entry_sign: Error: Song already playing");
				}
			} else{
				msg.channel.send(":no_entry_sign: Error: Nothing is playing");
			}
		},
		"Resumes a song"
	)
);

commands.push(
	new Command(
		"disconnect",
		function(client,msg){
			if(vc){
				queue = [];
				if(dispatcher){
					dispatcher.end();
					dispatcher = undefined;
				}
				if(vc){
					vc.leave();
					vc = undefined;
					queue = [];
				}
				msg.channel.send("Left voice channel.");
			} else{
				msg.channel.send(":no_entry_sign: Error: Not connected to voice channel");
			}
		},
		"Disconnects from voice channel"
	)
);

commands.push(
	new Command(
		"queue",
		function(client,msg){
			let embed = {};
			embed.title = "Queue";
			embed.fields = [];
			for(let i = 0; i < queue.length; i++){
				let item = queue[i];
				embed.fields.push({
					name: item.name,
					value: "Requested by **" + item.requester + "**"
				});
			}
			embed.footer = {
				text: "Do " + process.env.prefix + "queue for queue"
			};
			msg.channel.send({embed: embed});
		},
		"Displays queue"
	)
);

commands.push(
	new Command(
		"skip",
		function(client,msg){
			if(vc){
				if(dispatcher){
					dispatcher.end();
				} else{
					msg.channel.send(":no_entry_sign: Error: Nothing is playing");
				}
			} else{
				msg.channel.send(":no_entry_sign: Error: Not connected to voice channel");
			}
		},
		"Skips a song"
	)
);

//Export
module.exports = {
	name: "Music",
	hidden: false,
	commands: commands
};