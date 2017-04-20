var Discord = require("discord.js");
var client = new Discord.Client();

var defaultprefix = "^";
var prefix = "^";
var lastquote;
var embedtoggle = true;
var commands = {
	"ping": {
		"response": function(client, message, args) {
			actionResponse(message, "success", "Pong! Your ping is " + client.ping + "ms")
		},
		"bio": "Returns average ping \n Usage: " + prefix + "ping"
	},
	"help": {
		"response": function(client, message, args) {
			var helparray = getHelpDescription();
			for (var i = 0; i < helparray.length; i += 10) {
				var joined = helparray.slice(i, (i+10));
				var embed = new Discord.RichEmbed();
				if (embedtoggle) {
					embed.setColor(0x00FFFF);
					embed.setTitle("Available Selfbot Commands");
					embed.setDescription(joined);
					message.channel.sendEmbed(embed);
				}
				else {
					message.channel.sendMessage("Available Selfbot Commands \n" + joined);
				}
			}
		},
		"bio": "Displays a list of commands \n Usage: " + prefix + "help"
	},
	"say": {
		"response": function(client, message, args) {
			message.channel.sendMessage(args);
		},
		"bio": "Makes the bot (you) say something (lolwhyisthisneeded) \n Usage: " + prefix + "say <text>"
	},
	"rate": {
		"response": function(client, message, args) {
			if (args) {
				actionResponse(message ,"success", message.author.username + ", I rate " + args + " a " + getRandomIntInclusive(0,10) + "/10");
			}
			else {
				actionResponse(message ,"error", "Uh Oh! Please give something to rate!");
			}
		},
		"bio": "Rates something \n Usage: " + prefix + "rate <something to rate>"
	},
	"dice": {
		"response": function(client, message, args) {
			if (embedtoggle) {
				var embed = new Discord.RichEmbed();
				embed.setColor(0xFFFFFF);
				embed.setTitle(":game_die: " + getRandomIntInclusive(1, 6) + " :game_die:");
				message.channel.sendEmbed(embed);
			}
			else {
				message.channel.sendMessage(":game_die: " + getRandomIntInclusive(1, 6) + " :game_die:");
			}
		},
		"bio": "Rolls dice \n Usage: " + prefix + "dice"
	},
	"embed": {
		"response": function(client, message, args) {
			if (embedtoggle) {
				var embed = new Discord.RichEmbed();
				embed.setColor(0x7B68EE);
				embed.setAuthor(message.author.username, message.author.avatarURL);
				embed.setDescription(args);
				message.channel.sendEmbed(embed);
			}
			else {
				message.channel.sendMessage("Embeds are disabled");
			}
		},
		"bio": "Puts text in a nice embed \n Usage: " + prefix + "embed <text>"
	},
	"eval": {
		"response": function(client, message, args) {
			var evalexpression;
			try {
   			evalexpression = eval(args);
			}
			catch (e) {
   			console.log(e);
			}
			if (embedtoggle) {
				var embed = new Discord.RichEmbed();
				embed.setColor(0xFFFFFF);
				embed.addField("In", "```"+args+"```", false);
				embed.addField("Out", "```"+evalexpression+"```", false);
				message.channel.sendEmbed(embed);
			}
			else {
				message.channel.sendMessage("In" + "\n```"+args+"```\nOut\n" + "```"+evalexpression+"```");
			}
		},
		"bio": "Runs some code \n Usage: " + prefix + "eval <code>"
	},
	"quote": {
		"response": function(client, message, args) {
			var arglist = parseArguments(args, 2);
			var arg1 = arglist[0];
			var arg2 = arglist[1];
			var quotemessage;
			var recentmessages = message.channel.messages;
			if (arg1 == "id") {
				quotemessage = recentmessages.find(function(el) {
					return el.id == arg2;
				});
			}
			else if (arg1 == "search") {
				quotemessage = recentmessages.find(function(el) {
					return el.content.toLowerCase().startsWith(arg2.toLowerCase());
				});
			}
			else if (arg1 == "last") {
				if (lastquote) {
					quotemessage = lastquote;
				}
			}
			if (quotemessage) {
				lastquote = quotemessage;
				if (embedtoggle) {
					var embed = new Discord.RichEmbed();
					embed.setColor(0xFFFFFF);
					embed.addField(quotemessage.author.username+" - "+quotemessage.createdAt, "```"+quotemessage.content+"```", false);
					message.channel.sendEmbed(embed);
				}
				else {
					message.channel.sendMessage(quotemessage.author.username+" - "+quotemessage.createdAt + "\n```"+quotemessage.content+"```");
				}
			}
		},
		"bio": "Quotes a message \n Usage: " + prefix + "quote <id|search|last> <id of message if arg1 is id|search term if arg1 is search>"
	},
	"prefix": {
		"response": function(bot, message, args) {
				if (args) {
					prefix = args;
					actionResponse(message ,"success", "Prefix set to " + args);
				}
				else {
					prefix = defaultprefix;
					actionResponse(message ,"success", "Current set prefix has been reset to " + defaultprefix);
				}
		},
		"bio": "Sets a new prefix for your selfbot \n Usage: " + prefix + "prefix <new prefix>"
	},
	"toggleembed": {
		"response": function(client, message, args) {
			embedtoggle = !embedtoggle;
			message.channel.sendMessage("```Embeds are now " + embedtoggle + "```");
		},
		"bio": "Toggles embeds for the selfbot \n Usage: " + prefix + "toggleembed"
	},
	"purge": {
		"response": function(bot, msg, args) {
			var messages = msg.channel.messages.filterArray(function (el) {return el.author == bot.user;}).slice(0, (args));
			if (messages) {
				messages.forEach(function (el) {
					el.delete();
				});
			}
			else {
				actionResponse(msg, "error", "There was an error!");
			}
		},
		"bio": "Purges your messages \n Usage: " + prefix + "purge <amount>"
	},
}

function actionResponse(msg, result, message) {
	if (embedtoggle == true) {
		if (result == "success") {
			var embed = new Discord.RichEmbed();
			embed.setColor(0x00FF00);
			embed.setTitle(message);
			msg.channel.sendEmbed(embed);
		}
		else if (result == "error") {
			var embed = new Discord.RichEmbed();
			embed.setColor(0xFF0000);
			embed.setTitle(message);
			msg.channel.sendEmbed(embed);
		}
	}
	else {
		msg.channel.sendMessage("```" + message + "```");
	}
}

function getHelpDescription () {
	var descarray = [];
	for (var c in commands) {
		if (commands.hasOwnProperty(c)) {
			descarray.push("***"+ prefix + c + "*** - " + commands[c].bio + "\n\n");
		}
	}
	return descarray;
}

function parseArguments(args, argumentcount) {
	var words = args.split(" ");
	var out = words.splice(0, argumentcount - 1);
	var last = words.join(" ");
	out.push(last);
	return out;
}

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//command reply code
client.on("message", message => {
	// process !
	if (message.author == client.user) {
		if (message.content.startsWith(prefix)) {
				var commandWithArgs = message.content.substring(prefix.length);
				var ind = commandWithArgs.indexOf(" ");
				var command = (ind >= 0) ? commandWithArgs.substring(0, ind) : commandWithArgs;
				var args = (ind >= 0) ? commandWithArgs.substring(ind + 1) : "";
				if (commands.hasOwnProperty(command)) {
					var commandreply = commands[command].response;
					commandreply(client, message, args);
					message.delete();
				}
				else if (command) {
					actionResponse(message ,"error", "What's that? Unknown Command!");
				}
		}
	}
});

client.login("");
