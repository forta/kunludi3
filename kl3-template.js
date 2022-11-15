/*
  Module: kl3-template
  Description: 

*/

//var crumbs = require ('kl3-crumbs') // the multilingual breadcrumbs
delete require.cache[require.resolve('./modulos/kl3-crumbs/index.js')]
let crumbs = require ('./modulos/kl3-crumbs/index.js')

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
}

// Other functions -------------------------------------------------

