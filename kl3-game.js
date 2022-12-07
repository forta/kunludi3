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
const prompt_async = require("prompt-async");

let kunludi_proxy

const awaitingModesArray = ["free string", "keypress", "menu", "standard game choices"]

const kunludi_exporter = require ('./modulos/KunludiExporter.js');


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
	kunludi_exporter.setKunludiProxi(kunludi_proxyIn)
}

function inputText_validation (typedCommand, turnState) {

	let returnObject =  { value:0, com:[]}

	returnObject.com = returnObject.typedCommand.split(" ")
	if (turnState.awaitingMode <2 ) { // free string(1) or press key (1)
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
	//console.log ("returnObject.com: " + JSON.stringify(returnObject.com))
	value = parseInt(returnObject.com[0])
	if (isNaN(value)) {return returnObject}

	if (turnState.awaitingMode == 2) { // menu
		if (value < 0 || value>=turnState.menu.length) return returnObject
		returnObject.value = value
		return returnObject
	} if (turnState.awaitingMode == 3) { // choices
		if (value < 0 || value>=turnState.choices.length) return returnObject
		returnObject.value = value
		return returnObject
	}
	return returnObject

}

async function processInput (usercom, turnState) {

	if (userCom.com == "q") return

	let com = userCom.com
	let comValue = userCom.value
	//console.log ("User command: " + JSON.stringify(userCom))

	if (turnState.awaitingMode == 0) { // free string
		console.log ("Free text typed: " + JSON.stringify(userCom.com))
		//to-do: kunludi_proxy.sendFreeText(userCom.com)
	} else if (turnState.awaitingMode == 1) { // key pressed
		console.log ("Key pressed")
		kunludi_proxy.keyPressed()
	} else if (turnState.awaitingMode == 2) { // menu
		let pendingChoice = kunludi_proxy.getPendingChoice()
		let menuIndex = com[0]
		pendingChoice.action.option = turnState.menu[menuIndex].id
		pendingChoice.action.msg = turnState.menu[menuIndex].msg
		pendingChoice.action.menu = turnState.menu
		kunludi_proxy.processChoice (pendingChoice)
	} else { // standard game choice
		console.log ("Echo #" + comValue + ": " + kunludi_render.getChoice(turnState.choices[comValue]) )
		// if item, save it
		if (turnState.choices[comValue].choiceId == "obj1") {
			turnState.selectedItem = kunludi_render.getChoice (turnState.choices[comValue])
		} else {
			turnState.selectedItem = ""
		}
		// run user action
		kunludi_proxy.processChoice (turnState.choices[comValue])
	}


}

function getTurnState (turnState) {
	//kunludi_proxy.getGameIsOver()
	//kunludi_proxy.getCurrentChoice()
	//kunludi_proxy.getLastAction()
	//kunludi_proxy.getPlayerList() // not here

	turnState.turn = kunludi_proxy.getGameTurn()
	turnState.history = kunludi_proxy.getHistory()
	if (turnState.history.length >0) {
		turnState.lastHistoryReaction = turnState.history[turnState.history.length-1]
	}
	turnState.reactionList = kunludi_proxy.getReactionList()
	turnState.menu = kunludi_proxy.getMenu()
	turnState.awaitingMode = 3 // 0: free string; 1: keypress; 2: menu; 3: standard game choices
	if (1 == 2) { // to-do: kunludi_proxy.getPendingFreeString()) {
		turnState.awaitingMode = 0
	} else if (kunludi_proxy.getPendingPressKey()) {
		turnState.awaitingMode = 1
	} else if (turnState.menu.length > 0) {
		turnState.awaitingMode = 2
	} else {
		turnState.awaitingMode = 3 // standard
		turnState.choices = kunludi_proxy.getChoices()
	}

}

function showTurnState (turnState) {
	console.log ("Current turn: " + turnState.turn)
	if (turnState.history.length >0) {
		console.log ("\n┌----- Last Reaction --------┐")
		let lastHistoryReaction = turnState.history[turnState.history.length-1]
		console.log ("\n# " + lastHistoryReaction.gameTurn + "\n")
		console.log ("#Echo: " + kunludi_render.getChoice(lastHistoryReaction.action) + "\n")
		//console.log ("#Reaction:")
		kunludi_render.showReactionList(lastHistoryReaction.reactionList)
		console.log ("└------ Last Reaction --------┘")
	}

	if (turnState.reactionList.length > 0) {
		console.log ("\n┌----- Reaction in course --------┐")
		kunludi_render.showReactionList(turnState.reactionList)
		console.log ("└------ Reaction in course --------┘")
	}

	//console.log ("\nPC State:" + JSON.stringify(kunludi_proxy.getPCState()) + "\n")

	console.log ("┌-----Player choices ----------------------------┐\n")
	if (turnState.awaitingMode == 0) {
		// to-do: input text
	} else if (turnState.awaitingMode == 1) {
		console.log ("Pulsa tecla")
		kunludi_render.showMsg (kunludi_proxy.getPressKeyMessage())
	} else if (turnState.awaitingMode == 2) {
		kunludi_render.showMenu(turnState.menu)
	} else { // turnState.awaitingMode == 3
		console.log ("Tus aciones:")
		kunludi_render.showChoiceList(turnState.choices)
		if (turnState.selectedItem != "") {
			console.log ("\nSelected Item: " + turnState.selectedItem + "\n")
		}

	}
	console.log ("└-----Player choices ----------------------------┘")

}

async function playGame () {

	let turnState = {
		turn: -1,
		selectedItem: "",
		history: {},
		awaitingMode: 3
	}

	getTurnState (turnState)
	showTurnState (turnState)
	console.log ("Awaiting Mode: " + awaitingModesArray[turnState.awaitingMode] + "\n")

	// share state before getting Input
	kunludi_exporter.exportData(turnState)

	/*
		let userCom = inputText_validation (com.action, turnState)
		console.log ("userCom:" + JSON.stringify (userCom))

		if (userCom.com[0] == "q") return
		if (userCom.value < 0) {
			// reaction
			processInput(userCom, turnState);
		}
	*/

}
