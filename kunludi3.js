const prompt = require('prompt-sync')({sigint: true});
const kunludi_proxy = require ('./modulos/RunnerProxie.js');

let modName
let modPath
let currentMod
let crumbs
let stack = []
let state = {
	"kl3-loader": {game: {loaded:false} },
	"kl3-connector": {token:-1}
}


function refreshCommands () {
		state[modName] = currentMod.getState()

		// Debug:
		//console.log("state: " + JSON.stringify (state))

		crumbs.cleanCommands()
		// intrinsic commandsPtr

		// if any available subcontext
		crumbs.addCommand ("set-context", 1)
		crumbs.setAliases ("set-context", ["cc"])

		crumbs.addCommand ("go-back")
	  crumbs.setAliases ("go-back", [".."])
		//crumbs.addCommand ("set", 1)
		crumbs.addCommand ("exit")
		crumbs.setAliases ("exit", ["bye", "q", "quit"])
		//crumbs.addLocale ("es")
		//crumbs.translateContext ("es", "root", "exit", ["salir", "fin"])
		crumbs.addCommand ("help")
		crumbs.setAliases ("help", ["h", "?"])

		crumbs.addCommand ("exec")
		crumbs.setAliases ("exec", ["x"])

		if (modName == "kl3-main") {

			if (!state["kl3-loader"].game.loaded) {
				crumbs.addContext ("kl3-loader")
			} else {
					crumbs.addContext ("kl3-game")
			}
			crumbs.addContext ("kl3-connector")

		} else if (modName == "kl3-loader") {
		  crumbs.addCommand ("set-rol", 1)
			crumbs.setAliases ("set-rol", ["sr"])
		  crumbs.addCommand ("set-datasource", 1)
			crumbs.setAliases ("set-datasource", ["sds"])
		  crumbs.addCommand ("get-gamelist")
			crumbs.setAliases ("get-gamelist", ["ggl"])

			if (state[modName].gamelist.length > 0) {
		  	crumbs.addCommand ("set-game", 1)
				crumbs.setAliases ("set-game", ["sg"])
			}

			if (state[modName].game.id != null) {
		  	crumbs.addCommand ("get-info")
				crumbs.setAliases ("get-info", ["gi"])
				crumbs.addCommand ("load-game")
				crumbs.setAliases ("load-game", ["lg"])
			}

		} else if (modName == "kl3-game") {
			crumbs.addCommand ("play")
			crumbs.addContext ("kl3-files")

		} else if (modName == "kl3-connector") {
			crumbs.addCommand ("set-connector", 3)
			if (state[modName].token != -1) {
				crumbs.addCommand ("get-userList")
				crumbs.addCommand ("chat", 1)
			}

		} else if (modName == "kl3-files") {
			crumbs.addCommand ("get-savelist")
			crumbs.addCommand ("save", 1)
			crumbs.addCommand ("load", 1)
		}

}

function processModuleCommand (com) {

	if (com.length == 0) {
		console.log ("Empty command")
		return
	}

	if (com[0] == "exit") {
		console.log("See you")
		process.exit()
	} else if (com[0] == "help") {
		console.log("Help: kunludi3 is under construction...")
		console.log("")
	} else if (com[0] == "set-context") {
		if (!crumbs.contextExists (com[1])) {
			console.log ("Wrong context [" + com[1] + "]")
			return
		}

		// save state
		stack.push ({modName:modName})

		modName = com[1]
		let modPath = "./" + modName + ".js"
		delete require.cache[require.resolve(modPath)]
		currentMod = require (modPath)
		crumbs = currentMod.getCrumbs()
		crumbs.setModName (modName)

		// pointer to the main module
		if ((modName == "kl3-loader")||(modName == "kl3-game")) {
				currentMod.setKunludiProxi (kunludi_proxy)
		}


	} else if (com[0] == "go-back") { //back
		console.log ("Subcontext quit: " + modName)
		if (stack.length == 0) return

		// store child state
		state[modName] = currentMod.getState()

		let previousEntry = stack.pop()
		modName = previousEntry.modName
		let modPath = "./" + modName + ".js"
		delete require.cache[require.resolve(modPath)]
		currentMod = require (modPath)
		crumbs = currentMod.getCrumbs()
		crumbs.setModName (modName)

		// restore state
		currentMod.setState (previousEntry.state)
		state[currentMod] = currentMod.getState()
	} else {
		// code executed on the current module
		currentMod.execCommand (com)
	}

	console.log("")
	refreshCommands()

}

function inputPreprocessing (com) {
	let com0 = crumbs.commandResolution (com)

	if (com0 != "" ) {
		com[0] = com0
		//if (com[0]!=com0) console.log("You typed alias [" + com0 + "] instead of [" + com[0] + "]");
		console.log('Command: ' + com);
		return true
	}
	return false
}

function mainLoop () {

	// init
	modName = "kl3-main"
	modPath = "./" + modName + ".js"
	currentMod = require (modPath)
	crumbs = currentMod.getCrumbs()
	crumbs.setModName (modName)
	let com = [""]
	refreshCommands()

	for (;;) {

		console.log ("stack: " + JSON.stringify(stack))

		// input
		let typedCommand = prompt('# ');
		com = typedCommand.split(" ")
		if (! inputPreprocessing (com)) {
			continue
		}

		if ( (com[0] == "") || (com[0] == "set-context")  || (com[0] == "go-back") || (com[0] == "help")){
			// availableComs = crumbs.getCommands()
			crumbs.showCommands()
		}

	  // processing batch file
		if (com[0] != "exec") {
			// interactive command
			processModuleCommand (com)
		} else {
			// batch program
			let batch = ["cc kl3-loader", "ggl", "sg miqueridahermana", "gi", "lg", "..", "cc kl3-game", "play"]

			for (let p=0; p<batch.length;p++) {
				let com2 = batch[p].split(" ")
				console.log ("\nExecuting " + (p+1) + "/" + batch.length + ": " + JSON.stringify(com2) + "\n")
				if (inputPreprocessing(com2)) {
					//console.log ("Executing2 " + p + "/" + batch.length + ": " + JSON.stringify(com2))
					processModuleCommand (com2)
				}
			}

		}

	}
}

mainLoop()
