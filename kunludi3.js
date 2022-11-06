const prompt = require('prompt-sync')({sigint: true});

let localLoader = require ('./kl3-loader.js')

//var crumbs = require ('kl3-crumbs') // the multilingual breadcrumbs
let crumbs = require ('./modulos/kl3-crumbs/index.js')
crumbs.addCommand ("exit")
crumbs.setAliases ("exit", ["bye", "quit"])
crumbs.addLocale ("es")
crumbs.translateContext ("es", "root", "exit", ["salir", "fin"])

crumbs.addCommand ("help")
crumbs.addContext ("local-loader")
crumbs.addContext ("game")

console.log('Current context: kl3-loader');

while (true) {

  let llcrumbs=localLoader.getCrumbs()

  // crumbs.setContext ("local-loader", llcrumbs)
  localLoader.refreshCrumbs()
  let coms = llcrumbs.getCommands () // crumbs to get choices but not to exec them (no filters in the example)

  llcrumbs.showCommands () // dump

  let command = prompt('Prompt a command of the context kl3-loader: ');
  console.log('You typed: ' + command);

  localLoader.executeCommand (command)

  if (command == "..") {
    // crumbs.setContext ("..") // back to root context

    //if (game exits) {
    	//crumbs.addContext ("game")
    //}
    return

  }

}


//crumbs.selectCommand ("set-locale")


/*
// loader context (host)
crumbs.addContext ("/loader"),
crumbs.setModuleDescription ("/loader", "This context allows to load a local or remote game as a host, or simply connect to a remote shared game and be an obsrver.")

// note: a client could not have all the three context available

crumbs.addCommand ("/loader", "set context") // local, remote or observer
crumbs.addCommand ("/loader", "set server") // att: server (only if context is remote or observer)
crumbs.addCommand ("/loader", "set username")
crumbs.addCommand ("/loader", "set password")
crumbs.addCommand ("/loader", "connect")
crumbs.addCommand ("/loader", "get games") // att: games (paths or gameIds)
crumbs.addCommand ("/loader", "set gameId") // att: gameId (when context is remote or observer)
crumbs.addCommand ("/loader", "set gamePath") // att: path to game files (when context is local or remote)
crumbs.addCommand ("/loader", "get states") // att: states (paths or stateIds)
crumbs.addCommand ("/loader", "set state") // att.state: from now, the game state can be loaded, so the module /game is available

// game context: once the game is loaded / or connected as observer
crumbs.addContext ("/loader/game")
crumbs.setModuleDescription ("/loader/game", "The game engine")
crumbs.addCommand ("/loader/game", "start") // set initial state
crumbs.addCommand ("/loader/game", "get locales")
crumbs.addCommand ("/loader/game", "set locale")
crumbs.addCommand ("/loader/game", "get history")
crumbs.addCommand ("/loader/game", "get choices")
crumbs.addCommand ("/loader/game", "set choice")
crumbs.addCommand ("/loader/game", "hostingRequest") // ask for being the new host

// file
crumbs.setModuleDescription ("/loader/game/file", "Session actions")
crumbs.addCommand ("/loader/game/file", "set target") // ...
crumbs.addCommand ("/loader/game/file", "save")

// share a game
crumbs.addContext ("/loader/game/broadcast")
crumbs.setModuleDescription ("/loader/game/broadcast", "This context allows share the state of the loaded game")
crumbs.addCommand ("/loader/game/broadcast", "set server")
crumbs.addCommand ("/loader/game/broadcast", "set name")
crumbs.addCommand ("/loader/game/broadcast", "set prefs") // everyone or by subscription
crumbs.addCommand ("/loader/game/broadcast", "set decisionPolicy") // host, votation, FIFO
crumbs.addCommand ("/loader/game/broadcast", "share")
crumbs.addCommand ("/loader/game/broadcast", "get claims") // people who wants to connect to your game
crumbs.addCommand ("/loader/game/broadcast", "get hostingRequests") // people who wants to be the new host
crumbs.addCommand ("/loader/game/broadcast", "accept hostingRequest") // set the new host


// language
crumbs.addContext ("/language")
crumbs.setModuleDescription ("/language", "This context allows swtich from one language to another")

// users
crumbs.addContext ("/users")


crumbs.addContext ("/game/prefs")
crumbs.setModuleDescription ("/game/prefs", "Game prefs")

//brainstorm:
menu = crumbs.getMenu("/loader, "*", "all | modules | commands")

op = crumbs.getChoice(menu)

if (op == "/loader/exit") return

if (op == "/loader/local") {

}



*/