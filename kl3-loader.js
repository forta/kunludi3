/*
  Module: kl3-loader
  Description:
    In case of:
      host/local: return game data and modules from a directory
      host/remote: return game data and modules from a URL
      guess/local: n.a.
      guess/remote: establish connection to a shared game, return token

    Examples of use:
      execCom ("set-rol", "host") // "set-rol" is supposed in coms array
      execCom ("set-datasource", "./data/games/")
      execCom ("get-gamelist")
      execCom ("set-game", "0")
      execCom ("get-game")

*/

//var crumbs = require ('kl3-crumbs') // the multilingual breadcrumbs
delete require.cache[require.resolve('./modulos/kl3-crumbs/index.js')]
let crumbs = require ('./modulos/kl3-crumbs/index.js')

// state
let state = {
   rol:"host", // host or guess
   ds:null, // datasource: local or remote
   game:null // game
}

module.exports = exports = {
	// crumbs interface
  getCrumbs:getCrumbs,
  getCommands:getCommands,
	execCom:execCom,
	getState:getState,
	setState:setState,

  // other functions
  setRol:setRol, // host (local execution) or guess (remote execution)
  setDataSource:setDataSource, // directory or URL
  getGameList:getGameList,
  setGame:setGame,
  getGame:getGame,
  //dump:dump
}

// crumbs functions -------------------------------------------------

function getCrumbs () {
	return crumbs
}

function getCommands () {

  // ordinary commands
  crumbs.addCommand ("set-rol")
  crumbs.addCommand ("set-datasource")
  crumbs.addCommand ("get-gamelist")
  crumbs.addCommand ("set-game")
  crumbs.addCommand ("get-game")

  return crumbs.getCommands()
}

function execCom(com) {
  if (crumbs.commandExists(com)) {
    console.log ("Command " + com + " exits!")
  } else {
    console.log ("Command " + com + " not exits!")
  }
}

function getState() {
  return state
}

function setState(stateIn) {
  state = stateIn
}

// Other functions -------------------------------------------------


function setRol(rolIn) {
  rol = (rolIn == 'guess')? 'guess': 'host'
  refreshCrumbs()
}

function setDataSource(dsIn) {
  ds = dsIn
  // to-do: get games.json
  refreshCrumbs()
}

function getGameList() {
  gameList = [
    {id:"game1", title:"title1"},
    {id:"game2", title:"title2"}
  ]
  refreshCrumbs()
}

function setGame(gameIdIn) {
  gameId = gameIdIn
  refreshCrumbs()
}

function getGame() {
  return gameList[0]
}
