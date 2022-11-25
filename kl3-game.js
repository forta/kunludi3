/*
  Module: kl3-template
  Description:
	Commands:
		play

*/

//var crumbs = require ('kl3-crumbs') // the multilingual breadcrumbs
delete require.cache[require.resolve('./modulos/kl3-crumbs/index.js')]
let crumbs = require ('./modulos/kl3-crumbs/index.js')
const kunludi_render = require ('./modulos/KunludiRender.js');
const prompt = require('prompt-sync')({sigint: true});

let kunludi_proxy

// state
let state = {

}

module.exports = exports = {
	// crumbs interface
	getCrumbs:getCrumbs,
	getState:getState,
	setState:setState,
	execCommand:execCommand,

	// other functions
	  setKunludiProxi:setKunludiProxi,

}

// crumbs functions -------------------------------------------------

function getCrumbs () {
	return crumbs
}

function getState() {
  return state
}

function setState(stateIn) {
  state = stateIn
}

function execCommand(com) {
	console.log ("Executing [" + com + "] on module " + crumbs.getModName())

	if (com[0] == "play") {
			console.log ("The game stats here!")
			playGame()
	}

}

// Other functions -------------------------------------------------

function setKunludiProxi(kunludi_proxyIn) {
  kunludi_proxy = kunludi_proxyIn
}

function playGame () {

  for (;;) {

		//kunludi_proxy.getGameIsOver()
		//kunludi_proxy.getCurrentChoice()
		//kunludi_proxy.getLastAction()
		//kunludi_proxy.getPlayerList() // not here

		let turn = kunludi_proxy.getGameTurn()
		console.log ("Current turn: " + turn)

		let history = kunludi_proxy.getHistory()
		if (history.length >0) {
			let lastHistoryReaction = history[history.length-1]
			console.log ("\n# " + lastHistoryReaction.gameTurn + "\n")
			console.log ("#Echo: " + JSON.stringify(lastHistoryReaction.action))
			console.log ("#Text:" + JSON.stringify(lastHistoryReaction.reactionList))
		}

    console.log ("\n-Reaction List ----------------------------\n")
    kunludi_render.showReactionList(kunludi_proxy.getReactionList())

    console.log ("PC State:" + JSON.stringify(kunludi_proxy.getPCState()))
		console.log ("-Choices ----------------------------\n")
		// to-do: presskey / menu / choices / typing / links

		let menu = kunludi_proxy.getMenu()
		let choices

		if (kunludi_proxy.getPendingPressKey()) {
			console.log ("Pending Press Key: " + JSON.stringify(kunludi_proxy.getPendingPressKey()))
		  console.log ("Press Key Message: " + JSON.stringify(kunludi_proxy.getPressKeyMessage()))
		} else if (menu.length > 0) {
			console.log ("Menu: " + JSON.stringify(menu))

		} else {
			console.log ("Tus aciones:")
	    choices = kunludi_proxy.getChoices()
	    kunludi_render.showChoiceList(choices)
		}

		console.log ("\n ----------------------------\n")
    // get user action
    let com
    let typedCommand = prompt('# ');
    com = typedCommand.split(" ")
    if (com.length == 0) continue
    if (com.length == 0) {
      console.log ("Wrong command")
      continue
    }

    if (com[0] == "q") {
      console.log ("See you" )
      return
    }

    let comValue = com[0]

		// depending on the "awaiting state"

		if (kunludi_proxy.getPendingPressKey()) {
			// key pressed
			console.log ("Key pressed")
			kunludi_proxy.keyPressed()
		} else if (menu.length > 0) {
			let pendingChoice = kunludi_proxy.getPendingChoice()
			let menuIndex = com[0]
			pendingChoice.action.option = menu[menuIndex].id
			pendingChoice.action.msg = menu[menuIndex].msg
			pendingChoice.action.menu = menu
			kunludi_proxy.processChoice (pendingChoice)
		} else {
	    console.log ("Echo #" + comValue + ": " + kunludi_render.getChoice(choices[comValue]) )
	    // run user action (demo)
	    kunludi_proxy.processChoice (choices[comValue])
		} // to-do: if menu
  }
}
