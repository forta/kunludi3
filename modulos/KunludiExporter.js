const request = require('request');

let connector = {url: "127.0.0.1:3000", enabled: false}
let kunludi_proxy

module.exports = exports = { // commonjs
//export default {
  setConnector: setConnector,
  setKunludiProxi: setKunludiProxi,
  exportDataInternal: exportDataInternal,
  exportData: exportData,
  importData: importData
}

function setKunludiProxi(kunludi_proxyIn) {
  kunludi_proxy = kunludi_proxyIn
}

async function exportDataInternal(turnState) {

  let url = "http://" + connector.url + "/api/logon"

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

  exportDataInternal(turnState).then ((result) => {
    console.log ("******************************** ExportData result: " +  JSON.stringify(result))
  })
  .catch(e => {
    console.error('*************************************** Error on launching exportData: ' +  e)
  });
}

function setConnector (connectorIn) {
  console.log ("set connector to: " + JSON.stringify(connectorIn))
	connector = connectorIn
}


function importDataInternal() {

  let url = "http://" + connector.url + "/api/logon"

	let options = {
		method: 'get',
		//json: true,
		url: url,
		headers: { } // Specify headers, if any
	}

	return new Promise(function (resolve, reject) {
		request(options, function (err, res, body) {
		  if (err) {
				return reject(err)
		  }
			resolve (body)
		});
  })

}

function importData() {

  // if (!connector.enabled) return

  console.log ("importing data")

  importDataInternal().then ((result) => {
    console.log ("******************************** ImportData result: ok")
    return result
  })
  .catch(e => {
    console.error('*************************************** Error on launching importData: ' +  e)
    return {error:-1}
  });
}
