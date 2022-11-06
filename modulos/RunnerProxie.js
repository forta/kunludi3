// remote connection -------------------------------
// const serverName = "www.kunludi.com"
// const serverName = "buitroff.ll.iac.es"
// const serverName = "paco-pc"
const serverName = "localhost"

// local connection -------------------------------
const kunludiLocalClient = require ('./KunludiLocalClient.js').default;
const kunludiClient = require ('./KunludiClient.js').default;
let connected = false

const KL_Delay = 500;

// refreshing
let refreshIntervalId = setInterval(refreshDataFromServer, KL_Delay);
// clearInterval(this.refreshIntervalId);

kunludiClient.setServerName(serverName)

//module.exports = exports = {
export default {
	initHttp:initHttp,
	join:join,
	getUserId:getUserId,
	getGameId:getGameId,
	getSlotId:getSlotId,
	logon:logon,
	logoff:logoff,
	quitGame:quitGame,
	resetGame:resetGame,
	resetGameSlot:resetGameSlot,
	//processUserCode:processUserCode,
	processChoice:processChoice,
	execLink:execLink,
	getCurrentChoice:getCurrentChoice,
	getPendingChoice:getPendingChoice,
	getLastAction:getLastAction,
	getGameIsOver:getGameIsOver,
	//getChoiceFilter:getChoiceFilter,
	getChoices:getChoices,
	getReactionList:getReactionList,
	getMenu:getMenu,
	getMenuPiece:getMenuPiece,
	getHistory:getHistory,
	setHistory:setHistory,
	getGameTurn:getGameTurn,

	getPCState:getPCState,

	saveGameState:saveGameState,
	deleteGameState:deleteGameState,
	renameGameState:renameGameState,

  requestGameSlotList:requestGameSlotList,
	getGameSlotList:getGameSlotList,
	resetGameTurn:resetGameTurn,
	getToken:getToken,
	getPlayerList:getPlayerList,
	sendChatMessage:sendChatMessage,
	linkChatMessages:linkChatMessages,
	refreshDataFromServer:refreshDataFromServer,
  getGames:getGames,
	loadGames:loadGames,
	keyPressed:keyPressed,
	setEnableChoices: setEnableChoices,
	getEnableChoices: getEnableChoices,
	getPendingPressKey: getPendingPressKey,
	getPressKeyMessage: getPressKeyMessage,

	setLocale:setLocale,
	// getKernelMessages:getKernelMessages, // to-delete?

	//??
	getGameSlotIndex:getGameSlotIndex,
	refreshGameSlotList:refreshGameSlotList


}

function initHttp(http) {
  this.Http = http
}

function storageON() {

    try {
        localStorage.setItem("__test", "data");
    } catch (e) {
        return false;
    }
    return true;
}

function setLocale (state) {

	this.locale = state.locale
	if (connected) {
  	kunludiClient.setLocale (state)
	} else {
		kunludiLocalClient.setLocale (state)
	}
}

function getKernelMessages () {

	if (connected) {
	  return kunludiClient.getKernelMessages()
	} else {
	  return kunludiLocalClient.getKernelMessages()
	}

}


/**
 * Calculate a 32 bit FNV-1a hash
 * https://stackoverflow.com/questions/41649250/js-hashing-function-should-always-return-the-same-hash-for-a-particular-string
 * Found here: https://gist.github.com/vaiorabbit/5657561
 * Ref.: http://isthe.com/chongo/tech/comp/fnv/
 *
 * @param {string} str the input value
 * @param {boolean} [asString=false] set to true to return the hash value as
 *     8-digit hex string instead of an integer
 * @param {integer} [seed] optionally pass the hash of the previous chunk
 * @returns {integer | string}
 */
function hashFnv32a(str, asString, seed) {
    /*jshint bitwise:false */
    var i, l,
        hval = (seed === undefined) ? 0x811c9dc5 : seed;

    for (i = 0, l = str.length; i < l; i++) {
        hval ^= str.charCodeAt(i);
        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }
    if (asString) {
        // Convert to 8 digit hex string
        return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
    }
    return hval >>> 0;
}


function getGameId () {
	if (connected) {
		return kunludiClient.getGameId()
	} else {
		return kunludiLocalClient.getGameId()
	}
}

function getSlotId () {
	if (connected) {
		return kunludiClient.getSlotId()
	} else {
		return kunludiLocalClient.getSlotId()
	}
}


function getUserId () {
	if (connected) return kunludiClient.getUserId()
	return ''
}

function logon (userId, password) {
  kunludiClient.logon(userId, this.locale)
}

function logoff () {
	kunludiClient.logoff()
	kunludiLocalClient.quitGame()
}

function loadGames () {
	if (!connected) {
    kunludiLocalClient.loadGames() // only for local data
	}
}


function quitGame () {
	if (connected) {
		kunludiClient.quitGame()
		refreshDataFromServer()
	} else {
		kunludiLocalClient.quitGame ()
	}
}

function resetGame () {
	if (connected){
		kunludiClient.resetGame()
	} else {
		kunludiLocalClient.resetGame () // not yet implemented
	}
}

function resetGameSlot (gameId, slotId, newLocal) {
	if (connected) {
		kunludiClient.resetGameSlot(gameId, slotId, newLocal)
	}
}

/*
function processUserCode (functionId, par) {
	if (connected) {
		return kunludiClient.sendUserCode(functionId, par)
	} else {
		return kunludiLocalClient.sendUserCode (functionId, par)
	}

}
*/

function processChoice (choice, optionMsg) {

	if (connected) {
		let choiceWithUser = choice // adding who makes the action
		choiceWithUser.userId = kunludiClient.getUserId()
	  this.currentChoice = choiceWithUser
		kunludiClient.sendChoice(choiceWithUser, optionMsg)
	} else {
		kunludiLocalClient.sendChoice (choice, optionMsg)
	}

}

function execLink (param) {

	if (connected) {
		let choiceWithUser = choice // adding who makes the action
		choiceWithUser.userId = kunludiClient.getUserId()
	  this.currentChoice = choiceWithUser
		//kunludiClient.execLink(choiceWithUser, optionMsg)
		console.log ("execLink: not implemented yet")
	} else {
		kunludiLocalClient.execLink (param)
	}

}


function getEnableChoices() {

	if (connected)
		return kunludiClient.getEnableChoices()
	else {
		return kunludiLocalClient.getEnableChoices()
	}

}

function getPendingPressKey() {

	if (connected)
		return kunludiClient.getPendingPressKey()
	else {
		return kunludiLocalClient.getPendingPressKey()
	}

}

function getPressKeyMessage () {

	if (connected) {
		return kunludiClient.getPressKeyMessage()
	} else {
		return kunludiLocalClient.getPressKeyMessage()
	}

}

function setEnableChoices (value) {

	if (connected) {
		kunludiClient.setEnableChoices()
	} else {
		return kunludiLocalClient.setEnableChoices(value)
	}
}

function keyPressed () {

	if (connected) {
		kunludiClient.keyPressed()
	} else {
		return kunludiLocalClient.keyPressed()
	}
}

function getCurrentChoice() {

	if (connected)
		return kunludiClient.getCurrentChoice()
	else {
		return kunludiLocalClient.getCurrentChoice()
	}

}

function getPendingChoice() {

	if (connected)
		return kunludiClient.getPendingChoice()
	else {
		return kunludiLocalClient.getPendingChoice()
	}

}

function getLastAction() {

	if (connected)
		return kunludiClient.getChoices()
	else {
		return kunludiLocalClient.getLastAction()
	}
}

function getGameIsOver() {

	if (connected)
		return kunludiClient.getGameIsOver()
	else {
		return kunludiLocalClient.getGameIsOver()
	}
}

/*
function getChoiceFilter() {

	if (connected)
		return kunludiClient.getChoiceFilter()
	else {
		return kunludiLocalClient.getChoiceFilter()
	}
}
*/

function getChoices() {

	if (connected)
		return kunludiClient.getChoices()
	else {
		return kunludiLocalClient.getChoices()
	}
}

function getReactionList() {

	// to-do: if game loaded
	if (connected)
		return kunludiClient.getReactionList()
	else {
		return kunludiLocalClient.getReactionList()
	}

}

function getMenu() {

	if (connected)
		return kunludiClient.getMenu()
	else {
		return kunludiLocalClient.getMenu()
	}

}

function getMenuPiece() {

	if (connected)
		return kunludiClient.getMenuPiece()
	else {
	  return kunludiLocalClient.getMenuPiece()
	}

}

function getHistory() {
	if (connected)
		return kunludiClient.getHistory()
	else {
		return kunludiLocalClient.getHistory()
	}
}

function setHistory(history) {
	this.history = history.slice()
}


function getGameTurn() {
	if (connected)
		return kunludiClient.getGameTurn()
	else {
		return kunludiLocalClient.getGameTurn()
	}

}

function getPCState () {

	if (connected)
		return kunludiClient.getPCState()
	else {
		return kunludiLocalClient.getPCState()
	}
}

function saveGameState (slotDescription) {
	if (connected)
		kunludiClient.saveGameState(slotDescription)
	else {
		kunludiLocalClient.saveGameState(slotDescription)
	}
}

function join (gameId, slotId) {

	if (!connected) {
		kunludiLocalClient.join(gameId, slotId)
	} else {
		kunludiClient.join(gameId, slotId)
	}

}

function deleteGameState (gameId, slotId) {

	if (!connected) {
		kunludiLocalClient.deleteGameState(gameId, slotId)
	} else {
		alert ("Not implemented yet")
		//kunludiClient.deleteGameState(gameId, slotId)
	}

}

function renameGameState ( gameId, slotId, newSlotDescription) {

	if (!connected) {
		kunludiLocalClient.renameGameState(gameId, slotId, newSlotDescription)
	} else {
		alert ("Not implemented yet")
		//kunludiClient.renameGameState(gameId, slotId, newSlotDescription)
	}

}

function afterRefreshGameSlotList () {
	this.gameSlotList = kunludiClient.getGameSlotList()
}

function refreshGameSlotList (parGameId) {

	if (connected) {
		kunludiClient.refreshGameSlotList(parGameId)
		setTimeout(afterRefreshGameSlotList, KL_Delay)
	} else {
		kunludiLocalClient.refreshGameSlotList(parGameId)
		this.gameSlotList =  kunludiLocalClient.getGameSlotList()
	}

}

function getGames () {

	if (connected)
	  return kunludiClient.getGames()
	else {
		return kunludiLocalClient.getGames()
	}

}

function requestGameSlotList (filter) {
	if (connected) {
	  kunludiClient.requestGameSlotList(filter)
		setTimeout(afterRefreshGameSlotList, KL_Delay)
	} else {
		kunludiLocalClient.requestGameSlotList(filter)
	}
}

function getGameSlotList (gameId) {
	if (connected) {
	  return kunludiClient.getGameSlotList(gameId)
	} else {
	  return kunludiLocalClient.getGameSlotList(gameId)
	}
}

// internal
function getGameSlotIndex(gameId, slotId) {

	if (slotId == undefined) return -1

	this.refreshGameSlotList (gameId)

	for (var i=0;i<this.gameSlotList.length;i++) {
		if (this.gameSlotList[i] == undefined) continue
		if (this.gameSlotList[i].id == slotId) break
	}
	if (i < this.gameSlotList.length) return i
	return -1
}


function resetGameTurn () {

	return (this.gameTurn = 0)

}

function getToken() {

	if (!connected) return "anonymous"

  return kunludiClient.getToken()

}

function getPlayerList() {
	if (!connected) return

	return this.playerList
}

// send chat message to backserver
function sendChatMessage(chatMessage, target) {
	if (!connected) return
	kunludiClient.sendChatMessage(chatMessage, target)
}

function refreshDataFromServer() {

	if (!connected && kunludiClient.getUserId() != '') {
		// after SETUSERID
		connected = true
		console.log ("R.P. New userId: " + kunludiClient.getUserId())
	} else if (connected && kunludiClient.getUserId() == '') {
		// after RESETUSERID
		kunludiClient.logoff()
		connected = false
		console.log ("R.P. Logoff done")
		//kunludiLocalClient.quitGame()
	}

	if (connected) {
  	kunludiClient.refreshDataFromServer()
	}

}

function linkChatMessages(chatMessages) {
	 this.chatMessages = chatMessages
}
