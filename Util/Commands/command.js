module.exports = class Command{
	constructor(name,options,callback,description){
		this.name = name;
		if(typeof options == "function"){
			this.options = {
				prefix: process.env.prefix,
				hidden: false,
				roles: false
			};
			this.callback = options;
			this.description = callback;
		} else{
			this.options = options;
			this.callback = callback;
			this.options.prefix = process.env.prefix;
			this.description = description
		}
	}
	get args(){
		return (this.callback + "")
			.replace(/[/][/].*$/mg,"")
			.replace(/\s+/g,"")
			.replace(/[/][*][^/*]*[*][/]/g,"")
			.split("){",1)[0].replace(/^[^(]*[(]/,"")
			.replace(/=[^,]+/g,"")
			.split(",").filter(Boolean);
	}
	format(){
		let args = this.args.slice(2);
		let formatstring = "**" + this.options.prefix + this.name + " ";
		if(args.length > 0){
			for(let i = 0; i < args.length; i++){
				let arg = args[i];
				formatstring += "<" + arg + "> ";
			}
		}
		formatstring += "** | " + this.description;
		return formatstring;
	}
	execute(client,msg,args){
		args.unshift(msg);
		args.unshift(client);
		this.callback.apply(this,args);
	}
}