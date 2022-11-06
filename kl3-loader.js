/*
  Module: kl3-loader
  Description:
    In case of:
      host/local: return game data and modules from a directory
      host/remote: return game data and modules from a URL
      guess/local: n.a.
      guess/remote: establish connection to a shared game, return token
*/

//var crumbs = require ('kl3-crumbs') // the multilingual breadcrumbs
let crumbs = require ('./modulos/kl3-crumbs/index.js')

let rol="host" // host or guess
let ds // datasource: local or remote

//let kl3-local-loader // module
//let kl3-remote-loader // module
//let kl3-remote-guess // module
let game // game

module.exports = exports = {
  getCrumbs:getCrumbs,
  executeCommand:executeCommand,
  refreshCrumbs:refreshCrumbs,
  setRol:setRol, // host (local execution) or guess (remote execution)
  setDataSource:setDataSource, // directory or URL
  getGameList:getGameList,
  setGame:setGame,
  getGame:getGame,
  //dump:dump
}

function getCrumbs() {
  return crumbs
}

function executeCommand(com) {
  if (crumbs.commandExists(com)) {
    console.log ("Command " + com + " exits!")
  } else {
    console.log ("Command " + com + " not exits!")
  }
}

function refreshCrumbs() {
  crumbs.addCommand ("set-rol")
  crumbs.addCommand ("set-datasource")
  crumbs.addCommand ("get-gamelist")
  crumbs.addCommand ("set-game")
  crumbs.addCommand ("get-game")
}


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
