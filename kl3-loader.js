/*
  Module: kl3-loader

  set-rol
  set-datasource
  get-gamelist
  show-gamelist
  set-game
  get-info
  load-game

*/

//var crumbs = require ('kl3-crumbs') // the multilingual breadcrumbs
delete require.cache[require.resolve('./modulos/kl3-crumbs/index.js')]
let crumbs = require ('./modulos/kl3-crumbs/index.js')
let kunludi_proxy

// state
let state = {
   rol: "host", // host or guest
   ds: "./games", // datasource: directory or URL
   gamelist: [],
   game: {id:null,info:null,files:{}}
}

module.exports = exports = {
	// crumbs interface
  getCrumbs:getCrumbs,
	getState:getState,
	setState:setState,
  execCommand:execCommand,

  // other functions
  setKunludiProxi:setKunludiProxi,
  setRol:setRol, // host (local execution) or guess (remote execution)
  getRol:getRol,
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
        console.log ("to-do: try to get " + state.ds + "/api/gameList")
      }
      return
    }

    state.gamelist = getGameList()
    console.log ("state.gamelist was set")

  } else if (com[0] == "show-gamelist") {
    for(let index=0; index < state.gamelist.length; index++) {
      console.log (index + ": " + JSON.stringify (state.gamelist[index]))
    }

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

    if (state.rol == "guest") {
      console.log ("About: (to-do from server)")
      state.game.id = "unknownGameId"
      console.log ("state.game set to " + state.game.id)
      state.game.info = setGame (0)
      return
    }

    let index = 0
    for(; index < state.gamelist.length; index++) {
        if (state.gamelist[index].id === com[1]) break
    }
    if (index < state.gamelist.length) {
        state.game.id = com[1]
        console.log ("state.game set to " + state.game.id)
        state.game.info = setGame (index)
        console.log ("About: " + JSON.stringify(state.game.info))
    } else {
      console.log ("Wrong game " + com[1] + ". Choose a game in " + state.gamelist)
    }

  } else if (com[0] == "get-info") {
    if (state.game.id == null) {
      console.log ("Run set-game first")
      return
    }

    console.log ("Info: " + JSON.stringify(state.game.info))

  } else if (com[0] == "load-game") {

    if (state.game.id == null) {
      console.log ("Run set-game first")
      return
    }
    console.log ("Loading " + state.game.id)

    state.game.loaded = true
    state.game.files = {file1: "file1"}

    if (state.rol == "guest") {
        // to-do
        console.log ("to-do: link to " + state.game.id)
        return
    }


    let stateStuff = {locale:"es", kernelMessages: []}  //to-do: needed
    stateStuff.games = kunludi_proxy.getGames() //to-do: needed
    kunludi_proxy.setLocale(stateStuff)
    kunludi_proxy.refreshGameSlotList (state.game.id)
    kunludi_proxy.join (state.game.id, "default")  //  slotId = "default"
    kunludi_proxy.setLocale(stateStuff) // setLocale otra vez para tener los mensajes traducidos

    console.log (state.game.id + " loaded")

  } else {

    console.log ("Error running " + com)
  }

}

// Other functions -------------------------------------------------

function setKunludiProxi(kunludi_proxyIn) {
  kunludi_proxy = kunludi_proxyIn
}

function setRol(rolIn) {
  state.rol = (rolIn == 'guess')? 'guess': 'host'
  refreshCrumbs()
}

function getRol() {
  return state.rol
}

function setDataSource(dsIn) {
  ds = dsIn
  // to-do: get games.json
  refreshCrumbs()
}

function getGameList() {

  if (state.rol == "guest") {
    gameList = []
    gameList.push ({id:"unknownId", title:"unknownTitle"})
    return gameList
  }

  kunludi_proxy.loadGames()
  // to-do: locale?
  let stateInProxy = {locale:"es", kernelMessages: []}
  stateInProxy.games = kunludi_proxy.getGames()
  kunludi_proxy.setLocale(stateInProxy)
  //console.log ("stateInProxy.games: " + JSON.stringify (stateInProxy.games))

  gameList = []
  for (let i=0; i<stateInProxy.games.length;i++) {
    let langIndex = 0
    // to-do_ look for about.translation[langIndex].language == local
    gameList.push ({id:stateInProxy.games[i].name, title:stateInProxy.games[i].name})  // ,state.games[i].about[langIndex].title
  }
  return gameList

}

function setGame(gameIndex) {
  if (state.rol == "guest") {
    return {author:"unknown"}
  }

  let gameList = kunludi_proxy.getGames()
  let langIndex = 0

  // to-do_ look for about.translation[langIndex].language == local
  return gameList[gameIndex].about.translation[langIndex]

}

function getGame() {
  return gameList[0]
}
