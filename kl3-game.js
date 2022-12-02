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


// https://docs.replit.com/tutorials/predictive-text-engine
function inputText (awaitingMode, menu, choices) {
	let returnObject =  {typedCommand: "", value:0, com:[]}

	for (;;) {
		returnObject.typedCommand = prompt('# ');
		returnObject.com = returnObject.typedCommand.split(" ")
		if (awaitingMode <2 ) { // free string(1) or press key (1)
			return returnObject
		}
		returnObject.value = -1
		if (returnObject.com.length == 0) return returnObject
		// meta command "q"
		if (returnObject.com[0] == "q") {
			console.log ("See you" )
			return returnObject
		}

		// validation
		let value
		console.log ("returnObject.com: " + JSON.stringify(returnObject.com))
		value = parseInt(returnObject.com[0])
		if (isNaN(value)) continue

		if (awaitingMode == 2) { // menu
			if (value < 0 || value>=menu.length) continue
			returnObject.value = value
			return returnObject
		} if (awaitingMode == 3) { // choices
			if (value < 0 || value>=choices.length) continue
			returnObject.value = value
			return returnObject
		}
	}
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
			console.log ("\n┌-----Reaction List (turn in process) --------┐")
	    kunludi_render.showReactionList(reactionList)
			console.log ("└------Reaction List (turn in process) --------┘")
		}

    //console.log ("\nPC State:" + JSON.stringify(kunludi_proxy.getPCState()) + "\n")

		console.log ("-Player choices ----------------------------\n")
		// to-do: presskey / menu / choices / typing / links

		let menu = kunludi_proxy.getMenu()
		let choices
		let awaitingMode // 0: free string; 1: keypress; 2: menu; 3: standard game choices

	  if (1 == 2) { // to-do: kunludi_proxy.getPendingFreeString()) {
		  awaitingMode = 0
		} else if (kunludi_proxy.getPendingPressKey()) {
			console.log ("Pulsa tecla")
		  kunludi_render.showMsg (kunludi_proxy.getPressKeyMessage())
			awaitingMode = 1
		} else if (menu.length > 0) {
			kunludi_render.showMenu()
			awaitingMode = 2
		} else {
			awaitingMode = 3 // standard
			console.log ("Tus aciones:")
	    choices = kunludi_proxy.getChoices()
	    kunludi_render.showChoiceList(choices)

			if (selectedItem != "") {
				console.log ("\nSelected Item: " + selectedItem + "\n")
			}

		}

		console.log ("\nAwaiting Mode: " + awaitingMode + "\n")

		console.log ("\n ----------------------------\n")
    let userCom = inputText (awaitingMode, menu, choices)
		let com = userCom.com
		let comValue = userCom.value
		console.log ("User command: " + JSON.stringify(userCom))

		if (awaitingMode == 0) { // free string
			console.log ("Free text typed: " + JSON.stringify(userCom.com))
			//to-do: kunludi_proxy.sendFreeText(userCom.com)
		} else if (awaitingMode == 1) { // key pressed
			console.log ("Key pressed")
			kunludi_proxy.keyPressed()
		} else if (awaitingMode == 2) { // menu
			let pendingChoice = kunludi_proxy.getPendingChoice()
			let menuIndex = com[0]
			pendingChoice.action.option = menu[menuIndex].id
			pendingChoice.action.msg = menu[menuIndex].msg
			pendingChoice.action.menu = menu
			kunludi_proxy.processChoice (pendingChoice)
		} else { // standard game choice
	    console.log ("Echo #" + comValue + ": " + kunludi_render.getChoice(choices[comValue]) )
			// if item, save it
			if (choices[comValue].choiceId == "obj1") {
				selectedItem = kunludi_render.getChoice (choices[comValue])
			} else {
				selectedItem = ""
			}
	    // run user action
	    kunludi_proxy.processChoice (choices[comValue])
		}
  }
}
