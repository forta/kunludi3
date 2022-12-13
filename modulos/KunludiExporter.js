const request = require('request');

let connector = {url: "127.0.0.1:3000", enabled: false} // enabled means "exporting enabled"
let kunludi_proxy
let turnState
let nextUserAction

module.exports = exports = { // commonjs
//export default {
  setKunludiProxi: setKunludiProxi,
  setConnector: setConnector,
  getTurnState: getTurnState,
  getNextUserAction: getNextUserAction,

  // API
  exportData: exportData,
  importData: importData,
  importNextUserAction: importNextUserAction
}

function setKunludiProxi(kunludi_proxyIn) {
  kunludi_proxy = kunludi_proxyIn
}

function getTurnState() {
  return turnState
}

function setConnector (connectorIn) {
  console.log ("set connector to: " + JSON.stringify(connectorIn))
	connector = connectorIn
}

function getNextUserAction() {
  return nextUserAction
}


// API -------------------------------------------------------------

async function exportData_Internal(turnState) {

  let url = "http://" + connector.url + "/api/gameState"

	let options = {
		method: 'post',
		body: turnState,
		json: true,
		url: url,
		headers: { } // Specify headers, if any
	}

	return await new Promise(function (resolve, reject) {
		request(options, function (err, res, body) {
		  if (err) {
				return reject(err)
		  }
			resolve (body)
		});
  })

}

async function exportData(turnState) {

  if (!connector.enabled) return

  console.log ("exporting data")

  exportData_Internal(turnState).then ((result) => {

    //console.log ("******************************** ExportData result: " +  JSON.stringify(result))
  })
  .catch(e => {
    //console.error('*************************************** Error on launching exportData: ' +  e)
  });
}


async function importData_Internal() {

  let url = "http://" + connector.url + "/api/gameState"

	let options = {
		method: 'get',
		json: true,
		url: url,
		headers: { } // Specify headers, if any
	}

	return await new Promise(function (resolve, reject) {
		request(options, function (err, res, body) {
		  if (err) {
				return reject(err)
		  }
			resolve (body)
		});
  })

}

async function importData() {

  console.log ("importing data")

  await importDataInternal().then ((result) => {
    //console.log ("******************************** ImportData result: ok")
    turnState = result
  })
  .catch(e => {
    //console.error('*************************************** Error on launching importData: ' +  e)
    turnState = {error:-1}
  });
}


async function importNextUserAction_Internal() {

  let url = "http://" + connector.url + "/api/nextUserAction"

	let options = {
    method: 'post',
		body: turnState,
		json: true,
		url: url,
		headers: { } // Specify headers, if any
	}

	return await new Promise(function (resolve, reject) {
		request(options, function (err, res, body) {
		  if (err) {
				return reject(err)
		  }
			resolve (body)
		});
  })

}

async function importNextUserAction() {

  //console.log ("importing user actions")

  await importNextUserAction_Internal().then ((result) => {
    nextUserAction = result
    if (typeof nextUserAction == "undefined") return
    if (typeof nextUserAction.arrayEmpty == "number") return
    //console.log ("******************************** importNextUserAction result: ok" + JSON.stringify(result))

  })
  .catch(e => {
    //console.error('*************************************** Error on launching importNextUserAction: ' +  e)
    nextUserAction = {error:-1}
  });
}
