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
	if (com[0] == "play") {
			console.log ("The game stats here!")
			playGame()
	} else {
		console.log ("Error trying to execute [" + com + "] on module " + crumbs.getModName())
	}

}

// Other functions -------------------------------------------------

function setKunludiProxi(kunludi_proxyIn) {
  kunludi_proxy = kunludi_proxyIn
}

function playGame () {

	let selectedItem = ""
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
			console.log ("#Echo: " + kunludi_render.getChoice(lastHistoryReaction.action) + "\n")
			//console.log ("#Reaction:")
			kunludi_render.showReactionList(lastHistoryReaction.reactionList)
		}

		let reactionList = kunludi_proxy.getReactionList()
		if (reactionList.length > 0) {
			console.log ("\n┌-----Reaction List (turn in process) --------┐\n")
	    kunludi_render.showReactionList(reactionList)
			console.log ("\n└------Reaction List (turn in process) --------┘")
		}

    console.log ("\nPC State:" + JSON.stringify(kunludi_proxy.getPCState()) + "\n")
		if (selectedItem != "") {
			console.log ("\nSelected Item: " + selectedItem + "\n")
		}

		console.log ("-Player choices ----------------------------\n")
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

    // input option (begin) --------------------
    let com
    let typedCommand
		let comValue = -1
		for (;;) {
			typedCommand = prompt('# ');
			if (kunludi_proxy.getPendingPressKey()) break
			com = typedCommand.split(" ")
			if (com.length == 0) continue
			if (com[0] == "q") {
	      console.log ("See you" )
	      return
	    }
			// validation
			console.log ("com: " + JSON.stringify(com))
			if (isNaN(comValue = parseInt(com[0]))) continue
			if (comValue < 0 || comValue>=choices.length) continue
			break
		}
		// input option (end) --------------------

		console.log ("valid comValue: " + JSON.stringify(comValue))


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
			// if item, save it
			if (choices[comValue].choiceId == "obj1") {
				selectedItem = kunludi_render.getChoice (choices[comValue])
			} else {
				selectedItem = ""
			}

	    // run user action
	    kunludi_proxy.processChoice (choices[comValue])
		} // to-do: if menu
  }
}
