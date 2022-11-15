/*
  Module: kl3-loader
*/

//var crumbs = require ('kl3-crumbs') // the multilingual breadcrumbs
delete require.cache[require.resolve('./modulos/kl3-crumbs/index.js')]
let crumbs = require ('./modulos/kl3-crumbs/index.js')

// state
let state = {
   rol:"host", // host or guest
   ds:"./games", // datasource: directory or URL
   gamelist:[],
   game:{id:null,info:null,files:{}}
}

module.exports = exports = {
	// crumbs interface
  getCrumbs:getCrumbs,
	getState:getState,
	setState:setState,
  execCommand:execCommand,

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

function getState() {
  return state
}

function setState(stateIn) {
  state = stateIn
}

function execCommand(com) {
  console.log ("Executing [" + com + "] on module " + crumbs.getModName())

  if (com[0] == "set-rol") {
    if ((com[1] == "?") || ((com[1] != "host") && (com[1] != "guest"))) {
      console.log ("Rol must be on of these:")
      console.log ("\thost: to run a loaded game")
      console.log ("\tguest: to connect to a remote running game")
      console.log ("state.rol is " + state.rol)
      return
    }

    state.rol = com[1]

    // defaults
    if (com[1] == "host") state.ds = "./games"
    if (com[1] == "guest") state.ds = "http://localhost:8080"

    console.log ("state.rol set to " + state.rol)
    console.log ("state.ds set to " + state.ds)

  } else if (com[0] == "set-datasource") {
    if (com[1] == "?") {
      if (state.rol == "host") {
        console.log ("The datasource can be a local directory or an URL")
      } else {
        console.log ("An URL to an orchestrator server")
      }
      console.log ("state.ds is " + state.ds)
      return
    }

    state.ds = com[1]
    console.log ("state.ds set to " + com[1])

  } else if (com[0] == "get-gamelist") {
    if (com[1] == "?") {
      if (state.rol == "host") {
        console.log ("to-do: try to get " + state.ds + "games.json")
      } else {
        console.log ("to-do: try to get " + state.ds + "games.json")
      }
      return
    }

    // demo
    state.gamelist = ["game1" , "game2"]
    console.log ("state.gamelist set to " + state.gamelist)

  } else if (com[0] == "set-game") {
    if (com[1] == "?") {
      if (state.gamelist.length > 0) {
        console.log ("Choose a game in " + state.gamelist)
      } else {
        console.log ("You first have to get a game list")
      }
      return
    }

    if (state.gamelist.length == 0) {
      console.log ("You first have to get a game list")
    }

    let index = 0
    for(len = state.gamelist.length; index < len; index++) {
        if (state.gamelist[index] === com[1]) break
    }
    if (index < state.gamelist.length) {
        state.game.id = com[1]
        console.log ("state.game set to " + state.game.id)
        state.game.info = "info"
    } else {
      console.log ("Wrong game " + com[1] + ". Choose a game in " + state.gamelist)
    }

  } else if (com[0] == "get-info") {
    if (state.game.id == null) {
      console.log ("Run set-game first")
      return
    }
    console.log ("Info: " + state.game.info)

  } else if (com[0] == "load-game") {

    if (state.game.id == null) {
      console.log ("Run set-game first")
      return
    }
    console.log ("Loading " + state.game.id)

    console.log ("to-do: load " + state.game.id)
    state.game.loaded = true
    state.game.files = {file1: "file1"}

    console.log (state.game.id + " loaded")

  } else {

    console.log ("No reaction")
  }

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
