let games = []
let gameSlotList = []
let gameId = ''

let offlineMode = false // detailed console.log only when offline game

// language
let locale = "xx", language = {}

// game state
let runner

let reactionList = []
let history = []
let processedReactionList = []

// Telegram: botAction

//module.exports = exports = {
//exports = module.exports =  {
export default {

  loadGames:loadGames,
  join:join,
  loadGameState:loadGameState,

	setLocale:setLocale,

  getLocale:getLocale,
  getKernelMessages:getKernelMessages,

  getGames:getGames,

  refreshGameSlotList:refreshGameSlotList,

  quitGame:quitGame,
  getGameId:getGameId,
  getSlotId:getSlotId,
  requestGameSlotList:requestGameSlotList,
  getGameSlotList:getGameSlotList,

  getChoices:getChoices,

  getCurrentChoice:getCurrentChoice,

  getMenu:getMenu,
  getMenuPiece:getMenuPiece,
  getPendingChoice:getPendingChoice,

  getGameTurn:getGameTurn,

  getPCState:getPCState,
  saveGameState:saveGameState,
  deleteGameState:deleteGameState,
	renameGameState:renameGameState,

  getHistory:getHistory,

  getEnableChoices:getEnableChoices,
  getPendingPressKey:getPendingPressKey,
  getPressKeyMessage:getPressKeyMessage,
  getLastAction:getLastAction,
  getReactionList:getReactionList,

  //sendUserCode:sendUserCode,
  sendChoice:sendChoice,
  execLink:execLink,
  gameAction:gameAction,
  getGameIsOver:getGameIsOver,
  gameChoice:gameChoice,
  keyPressed:keyPressed,
  setEnableChoices:setEnableChoices,


  loadGame:loadGame, // internal
  loadGameState:loadGameState,  // internal
  refreshCache:refreshCache

}


function storageON() {

    try {
        localStorage.setItem("__test", "data");
    } catch (e) {
        return false;
    }
    return true;
}

function loadGames() {

    // to-do: catch /try
  	let gamesData = require ('../../data/games.json');

  	this.games = gamesData.games

  	// load all about files from all games
  	for (let i=0; i<this.games.length;i++) {
  		try {
  			this.games[i].about = require ('../../data/games/' + this.games[i].name + '/about.json');
  		}
  		catch(err) {
  			this.games[i].about = {
  				"ludi_id": "1",
  				"name": this.games[i].name,
  				"translation": [
  					{
  						"language": this.locale,
  						"title": "[" + this.games[i].name +"]",
  						"desc": "??",
  						"introduction": "??",
  						"author": {
  							"name": "??",
  							"ludi_account": "??",
  							"email": "??"
  						}
  					}
  				]
  			}

  		}

  	}
}

function join (gameId, slotId) {

  if (offlineMode) {
    console.log ("state.locale: " + state.locale)
    console.log ("Slot: " + slotId)
  }

  var subgameId = "", metaDealer, metaState

  var slotIndex = arrayObjectIndexOf (this.gameSlotList, "id", slotId)
  var gameWorld0

  // it is a  meta-game
  // if (typeof state.gameAbout.subgames == "object") {
  if (1 == 0) {
    metaDealer = require ('../../data/games/' + gameId + '/metaDealer.js').default;

    // get first metaState from file; else from localStorage
    if ((slotIndex < 0) || (slotId == "default")) {
      metaState = require ('../../data/games/' + gameId + '/metaState.json');

    } else {
      metaState = state.gameSlots[slotIndex].metaState
      subgameId = metaState.subgameId
    }

    metaDealer.dependsOn (metaState)

    // decide wich it is the next subgame to play
    var validSubgames = []
    if (subgameId == "") {

      // to-do: slotId is not needed becasue a new game is starting
      slotId = "default"

      var subgames = metaDealer.getSubgames()

      for (var g in subgames) {
          if (subgames[g].available()) {
              validSubgames.push (subgames[g].id)
          }
      }
    }

    if (validSubgames.length == 0) {
      alert ("No more modules to load: the game is over")
      return
    } else {
      if (validSubgames.length > 0) subgameId = validSubgames[0]
      alert ("Loading subgame " + subgameId +  " from metagame " + gameId + ". Valid subgames are: " + JSON.stringify (validSubgames))
    }

  }

  // get libVersion
  var gameIndex = arrayObjectIndexOf (this.games, "name", gameId)
  var libVersion = (typeof this.games[gameIndex].about.lib == "undefined")? 'v0.01': this.games[gameIndex].about.lib

  var primitives = require ('../components/libs/' + libVersion + '/primitives.js').default;
	var libReactions = require ('../components/libs/' + libVersion + '/libReactions.js').default;

  var gameReactions
  if (libVersion == 'v0.01') {
    gameReactions = require ('../../data/games/' + gameId + ((subgameId != "")? '/' + subgameId  : "") + '/gReactions.js').default;
  } else {
    gameReactions = require ('../components/libs/' + libVersion + '/userTemplate.js').default;
    gameReactions.usr = require ('../../data/games/' + gameId + ((subgameId != "")? '/' + subgameId  : "") + '/gReactionsUsr.js').default;

  }
	var langHandel = require ('../components/libs/' + libVersion + '/localization/' + this.locale + '/handler.js').default;

	// world
	var libWorld = require ('../components/libs/' + libVersion + '/world.json');

  if ((slotIndex < 0) || (slotId == "default")) {
    gameWorld0 =  require ('../../data/games/' + gameId + ((subgameId != "")? '/' + subgameId : "") + '/world.json')
  } else {
    gameWorld0 = JSON.parse(JSON.stringify(this.gameSlotList[slotIndex].world))
  }

	// load explicit data to the local engine
	this.loadGame (gameId, subgameId, primitives, libReactions, gameReactions, libWorld, gameWorld0, slotId, metaDealer, metaState)

  if ((slotIndex >= 0) && (slotId != "default")) {
    this.loadGameState (slotId, false)
    // refreshing dependences
    primitives.dependsOn(this.runner.world, this.reactionList, this.runner.PCState )
    this.runner.processChoice (this.currentChoice)
  } else {
    this.runner.processChoice ({ choiceId:'action0', action: {actionId:'look'}, isLeafe:true, noEcho:true} )
  }

  this.slotId = slotId
  this.refreshCache ()

  if (offlineMode) {
    console.log ("Game loaded!. Slot: " + slotId)
  }

	return true

}

function loadGame (gameId, subgameId, primitives, libReactions, gameReactions, libWorld, gameWorld, slotId, metaDealer, metaState) {
 // took from Runner Proxie

  	this.gameId = gameId
  	this.subgameId = subgameId
  	if (subgameId!= "") metaState.subgameId = subgameId

    // to-do: state?
  	//this.setLocale (state)

    this.runner = require ('../components/LudiRunner.js').default;

    if ( slotId == "default") {
  		// "compile" default ( == initial) state
  		this.runner.createWorld(libWorld, gameWorld)
  	} else {
  		this.runner.world = JSON.parse(JSON.stringify(gameWorld))

  		//  from this.runner.createWorld():
  		this.runner.gameTurn = 0; // to-do: not really
  		this.runner.devMessages = {}
  	}

  	this.reactionList = []

  	this.runner.dependsOn(primitives, libReactions, gameReactions, this.reactionList, metaDealer, metaState)

}


function loadGameState (slotId, showIntro) {
// took from Runner Proxie

	if (!storageON()) return

	this.refreshGameSlotList (this.gameId)


	// old: var slotIndex = this.getGameSlotIndex(this.gameId, slotId)
  var slotIndex = arrayObjectIndexOf (this.gameSlotList, "id", slotId)

	if (slotIndex<0) {
		console.log ("Game not loaded!. Slot: " + slotId)
	} else {

    this.runner.world = this.gameSlotList[slotIndex].world
    this.history = this.gameSlotList[slotIndex].history.slice()
		this.runner.gameTurn = this.gameSlotList[slotIndex].gameTurn
		this.runner.PCState = JSON.parse(JSON.stringify(this.gameSlotList[slotIndex].PCState))
		this.runner.menu = []
	}

	// show intro, after default game slot
	if ( (slotId == "default") && (showIntro == undefined) ) {
		this.currentChoice = { choiceId:'action0', action: {actionId:'look'}, isLeafe:true}
	} else {
		this.currentChoice = 	{choiceId:'top', isLeafe:false, parent:''}
	}

}

function setLocale (state) {

  if (offlineMode) {
    console.log ("locale: " + state.locale)
  }

  this.locale = state.locale

	this.language = require ('../components/LudiLanguage.js').default;

  this.language.setLocale (state.locale)

	// console.log ("this.gameId: " + this.gameId)

	this.kernelMessages  = require ('../../data/kernel/kernel_' + this.locale + '.json');
  state.kernelMessages [state.locale] = this.kernelMessages

	if ((this.gameId == "") || (this.gameId == undefined)) return

  // to-do: get libVersion for this game instead from golbal variable
  var gameIndex = arrayObjectIndexOf (state.games, "name", this.gameId)
  state.gameAbout = state.games[gameIndex].about
  var libVersion = (typeof state.gameAbout.lib == "undefined")? 'v0.01': state.gameAbout.lib

	this.langHandler = require ('../components/libs/' + libVersion + '/localization/' + this.locale + '/handler.js');

	this.libMessages = require ('../components/libs/' + libVersion + '/localization/' + this.locale + '/messages.json');
	this.gameMessages = require ('../../data/games/' + this.gameId + ((this.subgameId != "")? '/' + this.subgameId  : "") + '/localization/' + this.locale + '/messages.json')
	this.gameExtraMessages = require ('../../data/games/' + this.gameId + ((this.subgameId != "")? '/' + this.subgameId  : "") + '/localization/' + this.locale + '/extraMessages.json')
	//this.language.devMessages =  this.runner.devMessages

	this.language.dependsOn (this.kernelMessages,	this.libMessages, this.gameMessages, this.gameExtraMessages)

  // here! txt_final update for choices ??
  this.refreshCache()
}

function getLocale () {
  return this.locale
}

function getKernelMessages () {
  return this.kernelMessages
}


function getGames () {
  return this.games
}

function refreshGameSlotList (parGameId) {
  if (!storageON()) return

  var ludi_games = {}
  if (localStorage.ludi_games == undefined) localStorage.setItem("ludi_games", JSON.stringify({}));
  else ludi_games = JSON.parse (localStorage.ludi_games)

  if (ludi_games[parGameId] == undefined) {
    ludi_games[parGameId] = []
    localStorage.setItem("ludi_games", JSON.stringify(ludi_games));
  }
  this.gameSlotList = ludi_games[parGameId].slice()

}

function quitGame() {
  this.slotId = ""
}

function getGameId() {
  return this.gameId
}

function getSlotId() {
  return this.slotId
}

function requestGameSlotList(filter) {
  this.refreshGameSlotList (filter.gameId)
}

function getGameSlotList(gameId) {

  if (offlineMode) {
    console.log ("Checking gameId: " + gameId)
  }

  return this.gameSlotList
}

function getChoices() {
  return this.choices
}

function getCurrentChoice() {
  if (this.slotId=='') return
  return this.runner.getCurrentChoice()
}

function getMenu() {
  if (this.slotId=='') return

  if (typeof this.translation == 'undefined')
    return this.runner.menu
  else
    return this.translation.menu
}

function getMenuPiece() {
  if (this.slotId=='') return
  if (typeof this.translation == 'undefined')
    return this.runner.menuPiece
  else
    return this.translation.menuPiece
}

function getPendingChoice() {
  return this.pendingChoice
}

function getGameTurn() {
  if (this.slotId=='') return
  return this.runner.gameTurn

}

function getPCState() {
  if (this.slotId=='') return

  if (typeof this.translation == 'undefined')
    return this.runner.PCState
  else
    return this.translation.PCState
}

function saveGameState (slotDescription) {

  if (!storageON()) return

  // necessary to refresh data
	this.refreshGameSlotList (this.gameId)


  /*
  var slotIndex = arrayObjectIndexOf (this.gameSlotList, "id", slotId)
	if (slotIndex>=0) { // if name already exists
		// if it is the default slot, exit
		if (slotDescription == "default") {
			return
		} else {
			// name used
			console.log ("RunnerProxie. saveGameState(): Warning Name slot in use, try another one");
			return
		}
	}
  */


	var ludi_games = JSON.parse (localStorage.ludi_games)

	var d = +new Date

	ludi_games[this.gameId].push ({
		id: (slotDescription == "default")? "default": d,
		date: d,
		world: this.runner.world,
		history: this.history.slice(),
		gameTurn: this.runner.gameTurn,
		PCState: this.runner.PCState, // before: this.gameCache.PCState
		slotDescription: slotDescription,
		metaState: this.runner.metaState
	})

	this.gameSlotList = ludi_games[this.gameId].slice()
	localStorage.setItem("ludi_games", JSON.stringify(ludi_games));
	console.log ("Game slot saved on localStorage!")
}

function deleteGameState (gameId, slotId) {
  		if (!storageON()) return
  		var slotIndex = arrayObjectIndexOf (this.gameSlotList, "id", slotId)
  		if (slotIndex>=0) {
  			var ludi_games = JSON.parse (localStorage.ludi_games)
  			this.gameSlotList.splice(slotIndex,1)
  			ludi_games[gameId] = this.gameSlotList
  			localStorage.setItem("ludi_games", JSON.stringify(ludi_games));
  			console.log ("Game slot deleted!. Slot: " + slotId)
  		}
}

function renameGameState ( gameId, slotId, newSlotDescription) {

  		if (!storageON()) return

  		var i = this.getGameSlotIndex (gameId, slotId)
  		if (i>=0) {
  			var ludi_games = JSON.parse (localStorage.ludi_games)

  			ludi_games[gameId][i].slotDescription = newSlotDescription
  			this.gameSlotList[i].slotDescription = newSlotDescription
  			localStorage.setItem("ludi_games", JSON.stringify(ludi_games));

  			// refresh state
  			this.gameSlotList = ludi_games[gameId]

  			console.log ("Game slot " + slotId + " renamed: [" + newSlotDescription + "]")
  		}
}

function getHistory() {
  return this.history
}

function getEnableChoices() {
  if (this.slotId=='') return
  return this.runner.enableChoices
}

function getPendingPressKey() {
  if (this.slotId=='') return
  return this.runner.pendingPressKey
}

function getPressKeyMessage() {
  if (this.slotId=='') return
  if (typeof this.translation == 'undefined')
    return this.runner.pressKeyMessage
  else
    return this.translation.pressKeyMessage
}

function getLastAction() {
  if (this.slotId=='') return
  if (typeof this.translation == 'undefined')
    return this.runner.lastAction
  else
    return this.translation.lastAction
}

function getGameIsOver() {
  return this.runner.gameIsOver
}

function getReactionList() {

  		// from cached value
  		if (this.processedReactionList == undefined) this.processedReactionList = []

  	  for (let r in this.processedReactionList) {
  	    let reaction = this.processedReactionList[r]
  			if (reaction.type == "rt_dev_msg") {

  				let longMsgId = "messages." + reaction.txt + ".txt"

  				// show json line to add in the console

  				var line = "DEV MSG:\n," ;
  				line += "\t\"" + longMsgId + "\": {\n" ;
  				line += "\t\t\"" + "message\": \"" + reaction.detail + "\"\n" ;
  				line += "\t}";
  				console.log(line);

  				// if dev msg not exists, add in memory
  				if (this.gameMessages [longMsgId] == undefined) {
  					this.gameMessages [longMsgId] = {message:reaction.detail}
  				}
  			}

  		}

  		return this.processedReactionList.slice()
}

/*
function sendUserCode(functionId, par) {
  if (this.slotId=='') return
  let status = this.runner.processUserCode (functionId, par)
  this.refreshCache ()
  return status
}
*/

function execLink(param) {

  if (offlineMode) {
    console.log("execute link (locally): " + JSON.stringify(param))    
  }
  this.runner.execLink (param)
  this.refreshCache ()

}

function sendChoice(choice, optionMsg) {
  if (this.slotId=='') return
  this.runner.processChoice (choice, optionMsg)
  this.refreshCache ()

  return
  // load code

  // data.currentChoice = choice //?

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

function gameAction(choice, optionMsg) {

}

function gameChoice (choice, optionMsg) {

}

function setEnableChoices (value) {
  this.runner.setEnableChoices(value)
  this.refreshCache ()
}


function keyPressed () {
  this.runner.keyPressed()
  this.refreshCache ()
}


function refreshCache () {

	if (typeof this.language == "undefined") return
  if (typeof this.runner == "undefined") return

	if (typeof this.runner.devMessages != "undefined") {
		this.language.devMessages = this.runner.devMessages
	}

  // translation!
	var translatedStuff = {}
  this.translation = {}
	this.language.translateAll (this.locale, this.runner.history, this.runner, translatedStuff)

	// copy translated messages to proxy caché
	this.currentChoice = this.runner.getCurrentChoice()
	this.currentChoice.i8n = {}
	this.currentChoice.i8n[this.locale] = {}
	this.currentChoice.i8n[this.locale].txt = "viva currentChoice!"

	this.translation.PCState = JSON.parse(JSON.stringify(translatedStuff.PCState))
	this.processedReactionList = translatedStuff.processedReactionList.slice()
	this.choices = translatedStuff.choices
  for (var c in this.choices) {
    this.choices[c].txt_final = undefined
  }
	this.history = translatedStuff.history
	this.pendingChoice = this.runner.pendingChoice

	if (this.runner.pendingPressKey) {
		this.translation.pressKeyMessage = translatedStuff.pressKeyMessage
	}

	this.translation.lastAction = translatedStuff.lastAction

	this.translation.menu = translatedStuff.menu
	this.translation.menuPiece = this.runner.menuPiece

}

function arrayObjectIndexOf(myArray, property, searchTerm) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}
