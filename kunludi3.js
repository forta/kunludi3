const prompt = require('prompt-sync')({sigint: true});

let modName = "kl3-main"
let modPath = "./" + modName + ".js"
let currentMod = require (modPath)
let crumbs = currentMod.getCrumbs()
let stack = []
let state = {}

function refreshCommands () {
		console.log("state: " + JSON.stringify (state))

		crumbs.cleanCommands()
		// intrinsic commandsPtr

		// if any available subcontext
		crumbs.addCommand ("set-context", 1)
		crumbs.setAliases ("set-context", ["cc"])

		crumbs.addCommand ("go-back")
	  crumbs.setAliases ("go-back", [".."])
		//crumbs.addCommand ("set", 1)
		crumbs.addCommand ("exit")
		crumbs.setAliases ("exit", ["bye", "quit"])
		//crumbs.addLocale ("es")
		//crumbs.translateContext ("es", "root", "exit", ["salir", "fin"])
		crumbs.addCommand ("help")
		crumbs.setAliases ("help", ["h", "?"])


		if (modName == "kl3-main") {
			crumbs.addContext ("kl3-loader")
			//if (state.gameLoaded) {
			//	crumbs.addContext ("kl3-game")
			//}

			// if game available or already started
			//   crumbs.addCommand ("play")

			// if token gained
			//   crumbs.addCommand ("get-userList")
			//   crumbs.addCommand ("chat",1)

		} else if (modName == "kl3-loader") {
		  crumbs.addCommand ("set-rol", 1)
			crumbs.setAliases ("set-rol", ["sr"])
		  crumbs.addCommand ("set-datasource", 1)
			crumbs.setAliases ("set-datasource", ["sds"])
		  crumbs.addCommand ("get-gamelist")
			crumbs.setAliases ("get-gamelist", ["ggl"])

			if (state.gamelist.lenght > 0) {
		  	crumbs.addCommand ("set-game", 1)
			}

			// if game already selected
		  //   crumbs.addCommand ("get-game")
		}

}

function mainLoop () {

	crumbs.setModName (modName)
	refreshCommands()
	availableComs = crumbs.getCommands()
	crumbs.showCommands()

	for (;;) {

		// input
		let typedCommand = prompt('# ');
		let com = typedCommand.split(" ")
		if (com.length == 0) continue
		let com0 = com[0]
		com = crumbs.commandResolution (com)
		if (com.length == 0) {
			console.log ("Wrong command")
			continue
		}

		//if (com[0]!=com0) console.log("You typed alias [" + com0 + "] instead of [" + com[0] + "]");
		//console.log('Command: ' + com);

	  // processing commands
		if (com[0] == "set-context") {
			if (!crumbs.contextExists (com[1])) {
				console.log ("Wrong context [" + com[1] + "]")
				continue
			}

			stack.push ({modName:modName, state: currentMod.getState()})
			modName = com[1]
			let modPath = "./" + modName + ".js"
			delete require.cache[require.resolve(modPath)]
			currentMod = require (modPath)
			crumbs = currentMod.getCrumbs()
			crumbs.setModName (modName)
			state = currentMod.getState()
			console.log ("Subcontext loaded: " + modName)

			refreshCommands()
			availableComs = crumbs.getCommands()
			crumbs.showCommands()

			// to-do: pass parent state to the child?


		} else if (com[0] == "go-back") { //back
			console.log ("Subcontext quit: " + modName)
			if (stack.length == 0) return

			let oldModName = modName
			let oldState = currentMod.getState() // example: state of kl3-loader

			console.log("Estado del módulo abandonado: " + JSON.stringify(oldState))

			let previousEntry = stack.pop()
			console.log("Estado recuperado: " + JSON.stringify(previousEntry))
			modName = previousEntry.modName
			let modPath = "./" + modName + ".js"
			delete require.cache[require.resolve(modPath)]
			currentMod = require (modPath)
			crumbs = currentMod.getCrumbs()
			crumbs.setModName (modName)
			currentMod.setState (previousEntry.state)
			state = currentMod.getState()

			// put the child state in a branch
			state[oldModName] = oldState

			refreshCommands()
			availableComs = crumbs.getCommands()
			crumbs.showCommands()


			// passing the child state into the parent
			// to-do: currentMod.setStateBranch (oldModName, oldState)

		} else if (com[0] == "exit") {
			console.log("See you")
			return
		} else if (com[0] == "help") {
			console.log("Help: kunludi3 is under construction...")
			console.log("")
			refreshCommands()
			availableComs = crumbs.getCommands()
			crumbs.showCommands()
		} else {
			// code executed on the current module
			currentMod.execCommand (com)
		}

		console.log("")

	}
}

mainLoop()
