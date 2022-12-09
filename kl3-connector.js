/*
  Module: kl3-connector
  Description:
	Commands:
		set-connector, 1
		enable-connector,
		disable-connector,
		//get-userList
		//chat, 1

*/

//var crumbs = require ('kl3-crumbs') // the multilingual breadcrumbs
delete require.cache[require.resolve('./modulos/kl3-crumbs/index.js')]
let crumbs = require ('./modulos/kl3-crumbs/index.js')

// state
let state = {
	//token: -1,
	enabled: false,
	url: "localhost:3000"
}

module.exports = exports = {
	// crumbs interface
	getCrumbs:getCrumbs,
	getState:getState,
	setState:setState,
	execCommand:execCommand,

	// other functions
//	getConnector:getConnector

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
		// state.token = 123
	} else if (com[0] == "show-connector") {
		console.log ("Connector: [" + state.url + "] - Enabled: " + state.enabled)
	} else if (com[0] == "enable-connector") {
		console.log ("Enabled")
		state.enabled = true
	} else if (com[0] == "disable-connector") {
		console.log ("Disabled")
		state.enabled = false
	} else {
		console.log ("Error executing [" + com + "] on module " + crumbs.getModName())
	}

}

// Other functions -------------------------------------------------

/*
function getConnector() {
	return {url: state.url, enabled: state.enabled}
}
*/
