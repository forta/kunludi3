/*
  Module: kl3-connector
  Description:
	Commands:
		set-connector, 3
		get-userList
		chat, 1

*/

//var crumbs = require ('kl3-crumbs') // the multilingual breadcrumbs
delete require.cache[require.resolve('./modulos/kl3-crumbs/index.js')]
let crumbs = require ('./modulos/kl3-crumbs/index.js')

// state
let state = {
	token: -1

}

module.exports = exports = {
	// crumbs interface
	getCrumbs:getCrumbs,
	getState:getState,
	setState:setState,
	execCommand:execCommand,

	// other functions

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

	if (com[0] == "set-connector") {
		console.log ("to-do: Connecting to " + com[1] + ", " + com[2] + ", " + com[3])
		// to-do: simu
		state.token = 123
	}

}

// Other functions -------------------------------------------------
