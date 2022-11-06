const request = require('request');

let serverName = "localhost"

//module.exports = exports = {
export default {
	setServerName:setServerName,
	getServerName:getServerName,
	setLocale:setLocale,
	logon:logon,
	logoff:logoff,
	resetGameSlot:resetGameSlot,
	setGame:setGame,
	quitGame:quitGame,
	join:join,
	saveGameState:saveGameState,
	resetSlot:resetSlot,
	getImg:getImg,
	refresh:refresh,
	gameAction:gameAction,
	gameChoice:gameChoice,
	keyPressed:keyPressed,
	chat:chat
}

function setServerName(serverNameIn) {
	serverName = serverNameIn
}

function getServerName(serverNameIn) {
	return serverName
}

function setLocale(token, locale) {

	let url = 'http://' + serverName + ':8090/api/setLocale'

	let params = {"params":{"locale": locale, "token": token}}

	let options = {
		method: 'post',
		body: params,
		json: true,
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

function logon(userId, locale, hash) {
	let url = 'http://' + serverName + ':8090/api/logon'

	// hash: hashFnv32a (password==undefined?"":password, true), // password not sent but hash
	let params = {"params":{"userId":userId,"hash":"811c9dc5","locale":locale}}

	let options = {
		method: 'post',
		body: params,
		json: true,
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

function logoff (token) {
	let url = 'http://' + serverName + ':8090/api/logoff'

	let params = {"params":{"token":token}}

	let options = {
		method: 'post',
		body: params,
		json: true,
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

function resetGameSlot(token, gameId, slotId, newLocal) {

	let url = 'http://' + serverName + ':8090/api/resetgameslot'

	let params = {"params":{"gameId":gameId, "token":token,"slotId":slotId,"newLocal":newLocal}}

	let options = {
		method: 'post',
		body: params,
		json: true,
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

function setGame(token, gameId) {

	let url = 'http://' + serverName + ':8090/api/gameSlotList/' + token + '/' + gameId

  // console.log ("url: " + url)

	let options = {
		method: 'get',
		url: url,
		json: true
	}

 return new Promise(function (resolve, reject) {

		request(options, url, function (err, res, body) {
		  if (err) {
				return reject(err)
		  }
			resolve (body)

		});
  })
}

function quitGame(token) { //}, gameId, slotId) {
	let url = 'http://' + serverName + ':8090/api/disjoinlivegame'
	let params = {"params":{"token":token}} //,"gameId":gameId, "slotId":slotId}}

	let options = {
		method: 'post',
		body: params,
		json: true,
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

function join(token, gameId, slotId, historySize) {

	let url = 'http://' + serverName + ':8090/api/joinlivegame'
	// no va bien con ,"historySize":0 let params = {"params":{"gameId":gameId,"token":token,"slotId":slotId, "historySize": historySize}}
	let params = {"params":{"gameId":gameId,"token":token,"slotId":slotId}}

	let options = {
		method: 'post',
		body: params,
		json: true,
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

function saveGameState(token, slotDescription) {

	let url = 'http://' + serverName + ':8090/api/saveGameSlot'
	let params = {"params":{"token":token, "slotDescription": slotDescription}}

	let options = {
		method: 'post',
		body: params,
		json: true,
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

function resetSlot(token, gameId, slotId) {

	let url = 'http://' + serverName + ':8090/api/resetlivegame'
	let params = {"params":{"gameId":gameId,"token":token,"slotId":slotId}}

	console.log ("url: " + url)
	console.log ("params: " + JSON.stringify(params))

	let options = {
		method: 'post',
		body: params,
		json: true,
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

function getImg (token, fileName) {
	// get messages back from server
	let url = 'http://' + serverName + ':8090/api'
	url += '/getImg/' + token + '/' + fileName

	// console.log ("url: " + url)

	/*
	let getImage.dataURL = (url, imageType = 'image/jpeg') => {
	  return $http.get(url, {responseType: 'arraybuffer'}).then((res) => {
	    let blob = new Blob([res.data], {type: imageType});
	    return (window.URL || window.webkitURL).createObjectURL(blob);
	  });
	};
	*/

	let options = {
		url: url,
		json: true,
		// contentType: 'image/jpeg'
	}

	return new Promise(function (resolve, reject) {

		request.get(url, function (err, res, body) {
			if (err) {
				return reject(err)
			}

			console.log ("contentType: " + res.headers["content-type"])

			resolve ({status:0, contentType: res.headers["content-type"], data:body})
		});

	})
}

function refresh (token, chatMessagesSeq, gameTurn, reactionListCounter, playerListLogons, playerListLogoffs) {

	// get messages back from server
	let url = 'http://' + serverName + ':8090/api'
	url += '/refresh/' + token + '/' + chatMessagesSeq + '/' + gameTurn +  '/' + reactionListCounter + '/' + playerListLogons + '/' + playerListLogoffs

	// console.log ("url: " + url)

	// get
	let options = {
		method: 'get',
		url: url,
		json: true
	}

	return new Promise(function (resolve, reject) {

		request(options, url, function (err, res, body) {
			if (err) {
				return reject(err)
			}
			resolve (body)
		});

	})


}

function gameChoice (token, choice, optionMsg) {

	var url = 'http://' + serverName + ':8090/api/choice/' + choice.choiceId + '/' + token + '/'

	if (choice.choiceId == "itemGroup" ) {
		url += choice.itemGroup
	}	else if (choice.choiceId == "obj1" ) {
		url += choice.item1
	} else {
		url += "0"
	}

	// get
	let options = {
		method: 'get',
		url: url,
		json: true
	}

	return new Promise(function (resolve, reject) {

		request(options, url, function (err, res, body) {
		  if (err) {
				return reject(err)
		  }
			resolve (body)
		});

	})

}

function gameAction (token, choice, gameTurn, optionMsg ) {

	let url = 'http://' + serverName + ':8090/api/gameAction'
	let params = {"params":{"token": token,"choice":choice, "myGameTurn":gameTurn, "optionMsg":optionMsg}}


	let options = {
		method: 'post',
		body: params,
		json: true,
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

function keyPressed (token, lastAction, gameTurn) {

	var url = 'http://' + serverName + ':8090/api/keypressed'
	//lastAction: to-do: not used by now

	var params = {"params":{"token":token, "myGameTurn": gameTurn} }

		let options = {
			method: 'post',
			body: params,
			json: true,
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

function chat (token, target, chatMessage) {

// userId:this.userId

	let url = 'http://' + serverName + ':8090/api/chat'

	let params = {"params":{"token": token, "target": target, "chatMessage": chatMessage}}

	// console.log ("url: " + url)
	// console.log ("params: " + JSON.stringify(params))

	let options = {
		method: 'post',
		body: params,
		json: true,
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

/*
function chooseDialog (id, msg) {

	var choice =  JSON.parse(JSON.stringify(data2.gameState.pendingChoice))
	choice.action.option = id
	// to-do: choice.action.msg = msg
	choice.action.menu = JSON.parse(JSON.stringify(data2.gameState.menu))
	data2.menu = []
	choiceDialog (choice)

}
*/
