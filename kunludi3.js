const prompt = require('prompt-sync')({sigint: true});

let modName = "kl3-main"
let modPath = "./" + modName + ".js"
let currentMod = require (modPath)
let stack = []
for (;;) {
	console.log ("Current module: " +  modName)
	currentMod.getCrumbs().setModName (modName)
	availableComs = currentMod.getCommands()

	let typedCommand = prompt('# ');
	let com = typedCommand.split(" ")
  console.log('You typed: ' + com);

	if (com.length > 0) {
		currentMod.execCom (com[0])
		if (com[0] == "set-context") {
			stack.push ({modName:modName, state: currentMod.getState()})
			modName = com[1]
			currentMod.getCrumbs().setModName (modName)
			let modPath = "./" + modName + ".js"
			currentMod = require (modPath)
			console.log ("Subcontext loaded: " + modName)
		} else if (com[0] == "..") {
			console.log ("Subcontext quit: " + modName)
			if (stack.length == 0) return
			let oldState = currentMod.getState()
			console.log("Estado del módulo abandonado: " + JSON.stringify(oldState))
			let previousEntry = stack.pop()
			console.log("Estado recuperado: " + JSON.stringify(previousEntry))
			modName = previousEntry.modName
			currentMod.getCrumbs().setModName (modName)
			let modPath = "./" + modName + ".js"
			currentMod = require (modPath)
			currentMod.setState (previousEntry.state)
		}
	}
}
