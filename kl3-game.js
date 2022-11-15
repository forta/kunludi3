/*
  Module: kl3-template
  Description:
	Commands:
		play

*/

//var crumbs = require ('kl3-crumbs') // the multilingual breadcrumbs
delete require.cache[require.resolve('./modulos/kl3-crumbs/index.js')]
let crumbs = require ('./modulos/kl3-crumbs/index.js')

// módulo cargados por el proxy!:
const kunludi_proxy = require ('./modulos/RunnerProxie.js').default;

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

	if (com[0] == "play") {
			console.log ("The game stats here!")
	}



}

// Other functions -------------------------------------------------
