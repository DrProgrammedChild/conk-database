//Variables
var fs = require("dropbox-fs")({
	apiKey: process.env.db_key
});
var dbjson;
fs.readFile("/database.json",(err,res) => {
	dbjson = JSON.parse(res.toString());
});

//Classes
class User{
	constructor(databaseid){
		let entry = dbjson[databaseid];
		this.databaseid = databaseid;
		this.name = entry.name;
		this.id = entry.id;
		this.coins = entry.coins;
	}
	addCoins(amount){
		this.coins += amount;
		this.saveState();
	}
	takeCoins(amount){
		this.coins -= amount;
		this.saveState();
	}
	saveState(){
		fs.readFile("/database.json",(err,res) => {
			dbjson = JSON.parse(res.toString());
			dbjson[this.databaseid] = {
				name: this.name,
				id: this.id,
				coins: this.coins
			};
			fs.writeFile("/database.json",JSON.stringify(dbjson),console.log);
		});
	}
}

//Export
module.exports = {
	getUser: (member) => {
		return new Promise((resolve,reject) => {
			fs.readFile("/database.json",(err,res) => {
				dbjson = JSON.parse(res.toString());
				if(dbjson["id-" + member.id]){
					resolve(new User("id-" + member.id));
				} else{
					dbjson["id-" + member.id] = {
						name: member.user.username,
						id: member.id,
						coins: 10
					};
					fs.writeFile("/database.json",JSON.stringify(dbjson),console.log);
					resolve(new User("id-" + member.id));
				}
			});
		});
	}
};