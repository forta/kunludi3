// especie de nueva versión de RunnerProxie.js pero es sólo para conectarse con el servidor usando KunludiAPI.js

import kunludiAPI from './KunludiAPI.js'
// const kunludiAPI = require ('./KunludiAPI.js');

const libVersion = 'commonjs'

let numberOfRequests = 0
let refreshDataFromServer_Active = false

//module.exports = exports = { // commonjs
export default {
  setServerName:setServerName,
  getServerName:getServerName,
	setLocale:setLocale,

  getLocale:getLocale,
  getKernelMessages:getKernelMessages,

	logon:logon,
  logoff:logoff,

  getUserId:getUserId,

  getGames:getGames,

  refreshGameSlotList:refreshGameSlotList,

  setGame:setGame,
  getGameId:getGameId,
  requestGameSlotList:requestGameSlotList,
  getGameSlotList:getGameSlotList,
  join:join,

  quitGame:quitGame,
  resetGameSlot:resetGameSlot,

  getSlotId:getSlotId,
  getChoices:getChoices,

  getCurrentChoice:getCurrentChoice,

  getMenu:getMenu,
  getMenuPiece:getMenuPiece,
  getPendingChoice:getPendingChoice,

  getGameTurn:getGameTurn,

  getPCState:getPCState,
  saveGameState:saveGameState,

  getHistory:getHistory,

  getEnableChoices:getEnableChoices,
  getPendingPressKey:getPendingPressKey,
  getPressKeyMessage:getPressKeyMessage,
  getLastAction:getLastAction,
  getGameIsOver:getGameIsOver,
  getReactionList:getReactionList,

  sendUserCode:sendUserCode,
  sendChoice:sendChoice,
  sendChatMessage:sendChatMessage,

  gameAction:gameAction,
  gameChoice:gameChoice,
  keyPressed:keyPressed,
  setEnableChoices:setEnableChoices,

  getToken:getToken,

  refreshDataFromServer:refreshDataFromServer
}

let data = {
  languageList: ["en", "es", "eo", "fr"],
  //kernelMessages
  locale: "xx",

  token: undefined,
  gameId:'',
  slotId: '',

  games:[],
  gameSlotList:[],

  playerList:[],
  playerListLogons:0,
  playerListLogoffs: 0,

  userId:'',
  itemId:'',
  chatMessages:[],
  chatMessagesSeq: 0,

  // --- game state
  history: [],
  choices:[],
  gameTurn: undefined
  // reactionListCounter

  // botAction

}


function setLocale (state) {

  if (data.locale == state.locale) return

  kunludiAPI.setLocale (data.token, state.locale)
  .then ((result) => {
    if (result.status == 0) {
      console.log ("setLocale result: " +  result.locale)
      data.locale = result.locale
      data.kernelMessages = result.kernelMessages
      state.kernelMessages [state.locale] = result.kernelMessages
      state.choices = result.choices
    } else {
      console.log ("error on setLocale " + state.locale)
    }

  })
  .catch(e => {
    console.error('Error on setlocale: ' +  e)
  })
}

function getLocale () {
  return data.locale
}

function getKernelMessages () {
  return data.kernelMessages
}


/*
// Ref: https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Operadores/await
async function logon(userId, localeIn) {
  await logonPromise(userId, localeIn);
  return
}
*/

function logon(userId, localeIn) {

  var localePar = (localeIn == undefined ? data.locale: localeIn)

  console.log ("Trying to logon. server name: " + kunludiAPI.getServerName() )

  kunludiAPI.logon (userId, localePar, "hash")
  .then ((result) => {

      if (result.status >= 0) {

        data.token = result.token
        data.userId = userId
        data.games = JSON.parse(JSON.stringify(result.games))
        data.playerList = JSON.parse(JSON.stringify(result.playerList))
        data.kernelMessages = JSON.parse(JSON.stringify(result.kernelMessages))
        data.locale = result.locale

        // data.chatMessagesSeq ?
    		// data.playerListLogons
        // data.playerListLogoffs

        console.log ("User logged. locale: " + data.locale)
      } else {
        console.log ("User not logged.")
      }
  })
  .catch(e => {
    console.error('Error on logon: ' +  e)
  })

}

function logoff() {

  data.userId = ""
  data.chatMessagesSeq = this.gameTurn = 0
  data.playerListLogons = this.playerListLogoffs = 0

  kunludiAPI.logoff (data.token)
  .then ((result) => {
    // nothing to do here
  })
  .catch(e => {
    console.error('Error on logoff: ' +  e)
  })


}

function getUserId () {
  return data.userId
}

function getGames () {
  return data.games
}


function refreshGameSlotList (parGameId) {

  // almost same than setGame() but not setting gameId


  kunludiAPI.setGame(data.token, parGameId).then ((result) => {
    copyGameSlotListFromServer (result.gameSlotList)
  })
  .catch(e => {
    console.error('K.C. Error on refreshGameSlotList: ' +  e)
  })

}

function setServerName(serverName) {
	kunludiAPI.setServerName(serverName)
}

function getServerName() {
	return kunludiAPI.getServerName()
}

function quitGame() {

  kunludiAPI.quitGame()
  .then ((result) => {
      if (result.status == 0) {
        console.log ("\n\nK.C. disjoined from game\n") // : " + JSON.stringify (result) + "\n\n")
        data.slotId = ''
      }
  })
  .catch(e => {
    console.error('Error on join: ' +  e)
    console.log ("K.C. Error: The game was not loaded")
  })

}

function resetGameSlot(gameId, slotId, newLocal) { // restart game

  kunludiAPI.resetGameSlot (data.token, gameId, slotId, newLocal)
  .then ((result) => {

    if (result.status == 0) {
      data.gameId = gameId
      // data.gameSlotList = JSON.parse(JSON.stringify(result.gameSlotList))
      copyGameSlotListFromServer (result.gameSlotList)
    }

  })
  .catch(e => {
    console.error('Error on setGame: ' +  e)
  })

}

// to-do: for Telegram, where the game is selected first, and the slot is selected later
function setGame(gameId) {

  kunludiAPI.setGame (data.token, gameId)  // data.games[index].about.name
  .then ((result) => {

      if (result.status == 0) {
        data.gameId = gameId
        data.gameSlotList = JSON.parse(JSON.stringify(result.gameSlotList))
      } else {
        data.gameId = ""
        data.gameSlotList = []
      }
  })
  .catch(e => {
    console.error('Error on setGame: ' +  e)
  })

}

function getGameId() {
  return data.gameId
}

function getSlotId() {
  return data.slotId
}

function requestGameSlotList(filter) {
  refreshGameSlotList (filter.gameId)
}

function getGameSlotList() {
  return data.gameSlotList
}

function join(gameId, slotId) {

  if (data.slotId != "") {
    console.log("Just joined?")
    // return
  }

  data.gameId = gameId // tricky?

  // data.connectionState = -1 // initial state
  data.reactionList = []
  data.PCState = {}


  kunludiAPI.join (data.token, data.gameId, slotId, 0)
  .then ((result) => {

      if (result.status == 0) {

        //console.log ("\nRESULT.history: " + JSON.stringify (result.history) + "\n")
        //console.log ("\nRESULT.menu: " + JSON.stringify (result.menu) + "\n")
        console.log ("\n\nK.C. RESULT available after join\n") // : " + JSON.stringify (result) + "\n\n")
        data.slotId = slotId

        data.devMessages = result.devMessages
        data.choices = result.choices
        data.processedReactionList = result.reactionList
        data.currentChoice = result.currentChoice

        data.PCState = result.PCState

        data.gameTurn = (typeof result.gameTurn == undefined)? 0 : result.gameTurn

        data.history = result.history.slice()

        data.lastAction = result.lastAction

        data.pendingPressKey = result.pendingPressKey
        data.pressKeyMessage = result.pressKeyMessage
        data.pendingChoice = result.pendingChoice

        data.reactionListCounter = result.reactionListCounter

        data.menu = result.menu
        data.menuPiece = result.menuPiece

      } else {
        data.slotId = ''
        console.log ("K.C. Error: join with no result")

      }
  })
  .catch(e => {
    console.error('Error on join: ' +  e)
    console.log ("K.C. Error: The game was not loaded")
  })

}

function getChoices() {
  return data.choices
}

function getCurrentChoice() {
  return data.currentChoice
}


function getMenu() {
  return data.menu
}

function getMenuPiece() {
  return data.menuPiece
}

function getPendingChoice() {
  return data.pendingChoice
}

function getGameTurn() {
  return data.gameTurn
}

function getPCState() {
  return data.PCState
}

function saveGameState (slotDescription) {

  kunludiAPI.saveGameState (data.token, slotDescription)
  .then ((result) => {

      if (result.status < 0) {
        if (result.status == -2 ) {
  				alert ("You must be a registered user!")
  				return
  			}
        console.log ("Connection lost")
        data.token = undefined
        data.userId = ""
      }
  })
  .catch(e => {
    console.error('Error on saveGameState: ' +  e)
  })

}

function getHistory() {
  return data.history
}

function getEnableChoices() {
  return data.EnableChoices
}

function getPendingPressKey() {
  return data.pendingPressKey
}

function getPressKeyMessage() {
  return data.pressKeyMessage
}

function getLastAction() {
  return data.lastAction
}

function getGameIsOver() {
  return data.gameIsOver
}


function getReactionList() {
  return data.processedReactionList // to-do!
}

function sendUserCode(functionId, par) {
  console.log ("sendUserCode NOT IMPLEMENTED YET!!!!")
}

function sendChoice(choice, optionMsg) {

  data.currentChoice = choice //?

 // game actions
 if ( (choice.choiceId == "action0") ||
     (choice.choiceId == "dir1") ||
     (choice.choiceId == "action") ||
     (choice.choiceId == "action2") ) {

    gameAction (choice, optionMsg)

  } else if ( (choice.choiceId == "top") ||
       (choice.choiceId == "directActions") ||
       (choice.choiceId == "directionGroup") ||
       (choice.choiceId == "obj1") ||
       (choice.choiceId == "itemGroup" ) ) {

    gameChoice (choice, optionMsg)
  } else {
    console.log ("Unknown game choice")
  }

}

function sendChatMessage(chatMessage, target) {
  kunludiAPI.chat (data.token, target, chatMessage)
  .then ((result) => {

      if (result.status < 0) {
        console.log ("Connection lost")
        data.token = undefined
        data.userId = ""
      }

      copyGameChoicesFromServer (result)

  })
  .catch(e => {
    console.error('Error on gameChoice: ' +  e)
  })


}


function gameAction(choice, optionMsg) {

  kunludiAPI.gameAction (data.token, choice, data.gameTurn, optionMsg)
  .then ((result) => {

      if (result.status < 0) {
        console.log ("Connection lost")
        data.token = undefined
        data.userId = ""
      }

      //console.log ("\nRESULT.history: " + JSON.stringify (result.history) + "\n")
      //console.log ("\nRESULT.menu: " + JSON.stringify (result.menu) + "\n")
      console.log ("\n\nK.C. RESULT available after game action\n") // : " + JSON.stringify (result) + "\n\n")

      copyGameChoicesFromServer (result)
      copyGameDataFromServer (result)

  })
  .catch(e => {
    console.error('Error on gameAction: ' +  e)
  })

}

function gameChoice (choice, optionMsg) {

  if (choice.choiceId == "obj1" ) {
    if (typeof choice.botAction != 'undefined') {
      data.botAction = choice.botAction
    }
  }

  kunludiAPI.gameChoice (data.token, choice, data.gameTurn, optionMsg)
  .then ((result) => {

      if (result.status < 0) {
        console.log ("Connection lost")
        data.token = undefined
        data.userId = ""
      }

      copyGameChoicesFromServer (result)

  })
  .catch(e => {
    console.error('Error on gameChoice: ' +  e)
  })


}

function setEnableChoices () {
  console.log ("setEnableChoices: NOT IMPLEMENTED YET!!!!")
}

function keyPressed () {

  kunludiAPI.keyPressed (data.token, data.lastAction, data.gameTurn)
  .then ((result) => {

    if (result.status < 0) {
      console.log ("Connection lost")
      data.token = undefined
      data.userId = ""
    }

    //console.log ("\nRESULT.history: " + JSON.stringify (result.history) + "\n")
    //console.log ("\nRESULT.menu: " + JSON.stringify (result.menu) + "\n")
    console.log ("\n\nK.C. RESULT available (after key pressed)\n") // : " + JSON.stringify (result) + "\n\n")

    copyGameChoicesFromServer (result)
    copyGameDataFromServer (result)

  })
  .catch(e => {
    console.error('Error on gameChoice: ' +  e)
  })


}

function getToken () {
  return data.token
}

function refreshDataFromServer () {

  if (data.userId == '') return

  if (refreshDataFromServer_Active) return

  refreshDataFromServer_Active = true

  kunludiAPI.refresh (data.token,  data.chatMessagesSeq ,  data.gameTurn , data.reactionListCounter,  data.playerListLogons , data.playerListLogoffs)
  .then ((result) => {

    if (result.status < 0) {
      console.log ("Connection lost")
      data.token = undefined
      data.userId = ""
      refreshDataFromServer_Active = false
      return
    }

    if (result.status == 0) { // nothing new
      refreshDataFromServer_Active = false
      return
    }

    numberOfRequests++

    if (result.status & 1) { // new game related information
      copyGameChoicesFromServer (result.gameData)
      copyGameDataFromServer (result.gameData)
    }

    if (result.status & 2) { // new playerlist information
      copyPlayerListFromServer (result.players)
    }

    if (result.status & 4) { // new chat information
      copyChatDataFromServer (result.chat)
    }

  })
  .catch(e => {
    refreshDataFromServer_Active = false
    console.error('Error on refresh: ' +  e)
  })

}

// ----------------------------------------------------------------------------

function copyGameChoicesFromServer (result) {

	// copy choices
	if (data.choices.length>0) {
		data.choices.splice(0, data.choices.length) // empty array
	}
	for (let c in result.choices) {
		data.choices.push (JSON.parse(JSON.stringify(result.choices[c])))
	}
}

function copyGameDataFromServer (result) {

	if (result.gameTurn == undefined) return

	if (data.gameTurn >= result.gameTurn) return

  console.log ("\n\nK.C. numberOfRequests: " + numberOfRequests + "\n")
  numberOfRequests = 0

  data.gameTurn = result.gameTurn

	// copy reactionList
	if (data.processedReactionList!= undefined) {
		if (data.processedReactionList.length>0) {
			data.processedReactionList.splice(0, data.processedReactionList.length) // empty array
		}
		for (let r in result.reactionList) {
			data.processedReactionList.push (JSON.parse(JSON.stringify(result.reactionList[r])))
		}
	}

  // add incremental entries from history
	if ( result.history!= undefined) {
		console.log ("Increment history by " + result.history.length)
		if (typeof data.history == 'undefined') {
			data.history = []
		}
		for (let h in result.history) {
			data.history.push (JSON.parse(JSON.stringify(result.history[h])))
		}
	}

	data.devMessages == result.devMessages

	data.currentChoice = result.currentChoice
	data.lastAction = result.lastAction
	data.pendingPressKey = result.pendingPressKey
	data.pendingChoice = result.pendingChoice
	data.pressKeyMessage = result.pressKeyMessage
	data.reactionListCounter = result.reactionListCounter

	data.menu = result.menu
	data.menuPiece = result.menuPiece

	// to-do: response.result.PCState

}

function copyChatDataFromServer (result) {

	if (result.seq == undefined) return

  if (data.chatMessagesSeq >= result.seq) return

	data.chatMessagesSeq = result.seq

	console.log ("Chat messages from server: " + JSON.stringify(result.chatMessages))

	//copy chatMessages
	if (data.chatMessages != undefined ) {
		data.chatMessages.splice(0, data.chatMessages.length) // empty array
		for (var i=0; i<result.chatMessages.length && i<10;i++) {
			data.chatMessages [i] = result.chatMessages[i]
		}
	}
}


function copyPlayerListFromServer ( result) {

  if ((result.logons == undefined) || (result.logoffs == undefined) )  return

  // always it is updated (mainly for refreshing the active player language)

	data.playerListLogons = result.logons
	data.playerListLogoffs = result.logoffs

	// copy playerList
  data.playerList.splice(0, data.playerList.length) // empty array
	for (let c in result.playerList) {
		data.playerList.push (JSON.parse(JSON.stringify(result.playerList[c])))
	}

}

function copyGameSlotListFromServer (gameSlotList) {

	// copy game slots list
  data.gameSlotList.splice(0, gameSlotList.length) // empty array
	for (let c in gameSlotList) {
		data.gameSlotList.push (JSON.parse(JSON.stringify(gameSlotList[c])))
	}
}
