const request = require('request');

let server = "127.0.0.1:3000"
let kunludi_proxy

module.exports = exports = { // commonjs
//export default {
  setServer:setServer,
  setKunludiProxi:setKunludiProxi,
  exportDataInternal:exportDataInternal,
  exportData:exportData
}

function setServer(serverIn) {
  server = serverIn
}

function setKunludiProxi(kunludi_proxyIn) {
  kunludi_proxy = kunludi_proxyIn
}

async function exportDataInternal(turnState) {

  let serverName = "127.0.0.1"
	let url = 'http://' + serverName + ':3000/api/logon'

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

  console.log ("exporting data")

  exportDataInternal(turnState).then ((result) => {
    console.log ("******************************** ExportData result: " +  JSON.stringify(result))
  })
  .catch(e => {
    console.error('*************************************** Error on launching exportData: ' +  e)
  });
}
