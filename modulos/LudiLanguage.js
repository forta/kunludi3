// references to external modules
let kernelMessages, libMessages, gameMessages, extraMesssages
let locale

// module.exports = exports = {
export default {
	dependsOn:dependsOn,
  setLocale:setLocale,
  getLongMsgId:getLongMsgId,
  expandParams:expandParams,
  getBaseFromLongMsgId:getBaseFromLongMsgId,
  msgResolution:msgResolution,
  getExtraMessageFromLongMsgId:getExtraMessageFromLongMsgId,
  choiceTranslation:choiceTranslation,
  actionTranslation:actionTranslation,
  reactionTranslation:reactionTranslation,
  buildSentence:buildSentence,
  messageTranslation:messageTranslation,
	kTranslator:kTranslator,
	translateAll:translateAll
}

function arrayObjectIndexOf(myArray, property, searchTerm) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

function dependsOn (kernelMessages,libMessages,gameMessages, extraMesssages) {
	this.kernelMessages = kernelMessages
	this.libMessages = libMessages
	this.gameMessages = gameMessages
	this.extraMesssages = extraMesssages
}

function setLocale (locale) {
	this.locale = locale
}

// getLongMsgId: simply concat with dots and set default attibute if necessary
function getLongMsgId   (type, id, attribute) {

	var longMsgId

	if (type == 'actions')
		longMsgId = type + "." + id + ".txt"
	else
		longMsgId = type + "." + id + "." + attribute

	return longMsgId

}

function expandParams (textIn, param) {

	let availableParams = ["a1", "o1", "o2", "d1", "s1", "s2", "s3", "s4", "s5", "s6", "m1", "l1"] // to-do: yes, it's a botch
	let expandedParams = [], numParms = 0

	for (let i=0; i<availableParams.length;i++) {

		let p1, p2

		if ((p1 = textIn.indexOf("%" + availableParams[i])) >= 0) {   // parámeters like "%o1" and so on
			expandedParams[numParms] = {code: availableParams[i]}

			let type = "undefined!"
			if (availableParams[i][0] == "o") type = "items"
			else if (availableParams[i][0] == "d") type = "directions"
			else if (availableParams[i][0] == "a") type = "actions"
			else if (availableParams[i][0] == "s") type = "string"
			else if (availableParams[i][0] == "l") type = "link"
			else type = "messages"

			if (type == "string") {
				expandedParams[numParms].text = param[availableParams[i]] // text as is
			} else if (type == "link") {
				expandedParams[numParms].link = param[availableParams[i]]
			} else {
				expandedParams[numParms].longMsgId = this.getLongMsgId (type, param[availableParams[i]], "txt")
				expandedParams[numParms].base = this.getBaseFromLongMsgId (expandedParams[numParms].longMsgId)
			}

			// language-dependent modifiers

			if ((p2 = textIn.indexOf("_" + availableParams[i] +  "%")) >= 0) {

				// explicit modifiers
				expandedParams[numParms].modifiers = textIn.substring (p1+availableParams[i].length + 2,p2)

				// to-do:
				/*
				if (type == "items") {

					if (this.locale == "es") {
						expandedParams[numParms].properties = {articulo:true}

					} else if (this.locale == "en") {

					} else if (this.locale == "eo") {

						expandedParams[numParms].properties = {artikolo: true}

					} else if (this.locale == "fr") {

					}
				}
				*/

			} else {
				// default modifiers

				if (this.locale == "es") {
					expandedParams[numParms].properties = {articulo:true}
				} else if (this.locale == "en") {
					expandedParams[numParms].properties = {article:true}
				} else if (this.locale == "eo") {
					expandedParams[numParms].properties = {artikolo: true}
				} else if (this.locale == "fr") {
					expandedParams[numParms].properties = {article:true}
				}
			}

			numParms++
		}
	}


	return this.buildSentence (textIn, expandedParams)

}


function getBaseFromLongMsgId   (longMsgId) {
	var parts = longMsgId.split(".")
	return parts[0] + "." +  parts[1] + "."
}

function msgResolution (longMsgId) {

	var expanded = ""

	// external game level message resolution
	if (this.gameMessages  != undefined) {
		if (this.gameMessages [longMsgId] != undefined) expanded = this.gameMessages [longMsgId].message
	}

	// internal game level message resolution
	if ((expanded == "") && (this.devMessages  != undefined)) {
		let indexLang = ["en", "es", "eo", "fr"].indexOf(this.locale)
		if (indexLang<0) console ("RunnerProxie.js Missing locale: " + this.locale)
		else {
			if (typeof this.devMessages [this.locale] == "undefined") this.devMessages [this.locale] = {}
			if (this.devMessages [this.locale][longMsgId] != undefined) {
				expanded = this.devMessages [this.locale][longMsgId]
			}
		}
	}

	// lib  level message resolution
	if ((expanded == "") && (this.libMessages  != undefined)) {
		if (this.libMessages [longMsgId] != undefined) expanded = this.libMessages [longMsgId].message
	}

	/*
  if (expanded == "") {
		expanded = longMsgId + " not expanded"
	}
	*/

	return expanded
}

function getExtraMessageFromLongMsgId   (longMsgId) {

	if (this.extraMesssages != undefined) {
		if (this.extraMesssages[longMsgId] != undefined) return this.extraMesssages[longMsgId].message;
	}

	return
}


function endsWith (word, suffix) {
	return word.indexOf(suffix, word.length - suffix.length) !== -1;
}

let lang_modules = {en:{}, es: {}, eo: {}, fr: {} }

lang_modules.en.process = function (langModule, param) {

	var textOut = param.text

	if (param.text != undefined) return param.text
	else textOut = langModule.msgResolution (param.longMsgId)

	if (param.code.indexOf("o") >= 0) {

		if (param.properties.article) {
			var article = langModule.getExtraMessageFromLongMsgId (param.base + "article")
			if (article === undefined) article = "the"

			if (article !== "") textOut = article + " " + textOut
		}
	}

	return textOut

}

lang_modules.es.process = function (langModule, param) {

	var textOut = param.text

	if (param.text != undefined) return param.text
	else textOut = langModule.msgResolution (param.longMsgId)

	if (param.code.indexOf("o") >= 0) { // item
		var articulo = ""

		if (param.properties.articulo) {
			articulo = langModule.getExtraMessageFromLongMsgId (param.base + "articulo")
			if (articulo !== undefined) {
				textOut = articulo + " " + textOut
			}
		}
	} else if (param.code.indexOf("l") >= 0) { // link
		// textOut += "%l" + JSON.stringify (param.link) + "%l" // tricky
		textOut += "%l_" + param.link.txt + "_" + param.link.id + "_%l"
	}

	return textOut
}

lang_modules.eo.process = function (langModule, param) {

	var textOut = param.text

	if (param.text != undefined) return param.text
	else textOut = langModule.msgResolution (param.longMsgId)

	if (param.code.indexOf("o") >= 0) {
		if (param.properties.artikolo) {
			var artikolo = langModule.getExtraMessageFromLongMsgId (param.base + "artikolo")
			if (artikolo === undefined) artikolo = "la"

			if (artikolo != "") textOut = artikolo + " " + textOut
		}
	}

	return textOut
}

lang_modules.fr.process = function (langModule, param) {

	var textOut = param.text

	if (param.text != undefined) return param.text
	else textOut = langModule.msgResolution (param.longMsgId)

	if (param.code.indexOf("o") >= 0) {
		var article = ""

		if (param.properties.article) {
			article = langModule.getExtraMessageFromLongMsgId (param.base + "article")
			if (article !== undefined) {
				textOut = article + " " + textOut
			}
		}
	}

	return textOut
}


lang_modules.eo.akuzativigi = function (textIn) {
	// add "n" at the end of each word ending by "o", "a", "oj" or "aj", or if the word is a pronoun

	let words = textIn.split(" ");
	let textOut = ""
	let endings = ["a", "aj", "o", "oj"]
	let prepositions = ["de", "el", "da"]
	let pronomoj = ["mi", "vi", "li", "ŝi", "ĝi", "ci", "ni", "ili"]

	let noMore = false

	for (let w in words) {
		let doIt = false

		if (!noMore) {
			for (let e in endings) {
				if (endsWith(words[w], endings[e])) {
					if (words[w] == "la") continue
					doIt = true
					break
				}
			}
			for (let p in pronomoj) {
				if (words[w] == pronomoj[p]) {
					doIt = true
					break
				}
			}

		}

		if (!noMore) {
			for (let p in prepositions) {
				if (words[w] == prepositions[p]) {
					noMore = true
					if (doIt) doIt = false
					break
				}
			}
		}

		if (doIt) textOut += words[w] + "n"
		else textOut += words[w]

		textOut	+= " "

	}

	return textOut

}

function choiceTranslation (choice, isEcho) {

  if (typeof choice.i8n == 'undefined') choice.i8n = {}
  if (typeof choice.i8n[this.locale] == 'undefined') choice.i8n[this.locale] = {}
  if (typeof choice.i8n[this.locale].txt == 'undefined') choice.i8n[this.locale].txt = ""
  if (choice.i8n[this.locale].txt != '') return // just done before

  if ((choice.choiceId == 'top') ||
      (choice.choiceId == 'itemGroup') ||
      (choice.choiceId == 'directActions') ||
      (choice.choiceId == 'directionGroup')) {

			var txt = ""
			if (choice.choiceId == 'top') txt = this.kTranslator("mainChoices_" + choice.choiceId)
		  else if (choice.choiceId == 'itemGroup') txt = this.kTranslator("mainChoices_" +  choice.itemGroup) + "(" + choice.count + ")"
		  else if (choice.choiceId == 'directActions') txt = this.kTranslator("mainChoices_" + choice.choiceId) + "(" + choice.count + ")"
		  else if (choice.choiceId == 'directionGroup') txt = this.kTranslator("mainChoices_" + choice.choiceId) + "(" + choice.count + ")"

      choice.i8n[this.locale].txt = txt
  } else if (choice.choiceId == 'obj1') {

    choice.i8n[this.locale].txt = this.msgResolution (this.getLongMsgId ("items" , choice.item1Id,  "txt"))
		choice.itemId = choice.i8n[this.locale].txt

  } else {
    this.actionTranslation (choice, isEcho)
  }

}

function actionTranslation (choice, isEcho) {

  if (typeof choice.i8n == 'undefined') choice.i8n = {}
  if (typeof choice.i8n[this.locale] == 'undefined') choice.i8n[this.locale] = {}
  if (typeof choice.i8n[this.locale].txt == 'undefined') choice.i8n[this.locale].txt = ""
  if (choice.i8n[this.locale].txt != '') return // just done before

  let outText = "", outText4echo = ""

	if (choice.choiceId == 'action0') {

		outText = this.msgResolution(this.getLongMsgId ("actions", choice.action.actionId))
		// echo message
		outText4echo = outText

	}	else if ((choice.choiceId == 'action') || (choice.choiceId == 'action2')) {

		if (choice.choiceId == 'action') {
			outText = this.msgResolution(this.getLongMsgId ("actions", choice.action.actionId))
			// echo message
			let msg = this.msgResolution  (this.getLongMsgId ("messages", "Echo_o1_a1", "txt"))
			outText4echo =  this.expandParams (msg, {a1: choice.action.actionId, o1: choice.action.item1Id})
		} else {
			outText = this.msgResolution(this.getLongMsgId ("actions", choice.action.actionId)) +
								 " -> " +
								this.msgResolution(this.getLongMsgId ("items", choice.action.item2Id, "txt"))
 		// echo message
  		let msg = this.msgResolution  (this.getLongMsgId ("messages", "Echo_o1_a1_o2", "txt"))
	  	outText4echo = this.expandParams (msg, {a1: choice.action.actionId, o1: choice.action.item1Id, o2: choice.action.item2Id})
		}


	}  else if (choice.choiceId == 'dir1') {
		// show the target only ii it is known
		// console.log	("choice.action??: " + JSON.stringify(choice.action) )

		var txt = this.msgResolution(this.getLongMsgId ("directions", choice.action.d1Id, "desc"))
		if (choice.action.isKnown) txt += " -> " + this.msgResolution(this.getLongMsgId ("items", choice.action.targetId, "txt"))
		outText = txt
		outText4echo = outText

	}

	let playerSt = ""
  /*
	if (isEcho && this.getConnectionState() == 1 && (choice.userId != "") && (choice.userId != undefined)) {
			playerSt = "[" + choice.userId + "] "
	}
  */

  choice.i8n[this.locale].txt = playerSt + outText

	choice.i8n[this.locale].txt4echo = playerSt + outText4echo

}

function reactionTranslation (reaction) {

  if (typeof reaction.i8n == 'undefined') reaction.i8n = {}
  if (typeof reaction.i8n[this.locale] == 'undefined') reaction.i8n[this.locale] = {}
  if (typeof reaction.i8n[this.locale].txt == 'undefined') reaction.i8n[this.locale].txt = ""
  if (reaction.i8n[this.locale].txt != '') return // just done before

  // type: rt_msg rt_dec / txt
	reaction.i8n[this.locale].txt = "reaction!"
	if (typeof reaction.piece == 'undefined') reaction.piece = {}
	reaction.piece.type = 'text'

  if (reaction.type == "rt_refresh") return   // do nothing

  if (reaction.type == "rt_kernel_msg") {
		if (typeof reaction.param == "undefined") {
				reaction.i8n[this.locale].txt = this.kTranslator (reaction.txt)
				return
		}
		// if params:
		reaction.i8n[this.locale].txt = this.kTranslator (reaction.txt, reaction.param)

    return
  } else if (reaction.type == "rt_asis") {
    reaction.i8n[this.locale].txt = reaction.txt
    return
  }

  var expanded = ""

	let longMsg = {}

	if (
		(reaction.type == "rt_msg") ||
		(reaction.type == "rt_link") ||
		(reaction.type == "rt_graph") ||
		(reaction.type == "rt_quote_begin") ||
		(reaction.type == "rt_quote_continues") ||
		(reaction.type == "rt_play_audio") ||
		(reaction.type == "rt_end_game") ||
		(reaction.type == "rt_dev_msg") ||
		(reaction.type == "rt_press_key")
	) {
		longMsg = {type:'messages', id:reaction.txt, attribute:'txt'}
	} else if (reaction.type == "rt_desc") {
		longMsg.type = "items"
		longMsg.id = reaction.o1Id
		// console.log("rt_desc.o1Id: o1 " + reaction.o1 + " -> o1Id: " + reaction.o1Id + "!!!!!!!!!!!!")
		longMsg.attribute = "desc"
	} else if (reaction.type == "rt_item") {
		longMsg.type = "items"
		longMsg.id = reaction.o1Id
		// console.log("rt_item.o1Id: o1 " + reaction.o1 + " -> o1Id: " + reaction.o1Id + "!!!!!!!!!!!!")
		longMsg.attribute = "txt"
	} else {
		reaction.i8n[this.locale].txt = "reactionTranslation(): " + JSON.stringify(reaction)

		return
	}

	var longMsgId = longMsg.type + "." + longMsg.id + "." + longMsg.attribute

  // hardcoded translation available
	if (reaction.type == "rt_dev_msg") {
		if (this.gameMessages [longMsgId] == undefined) {
	 		this.gameMessages [longMsgId] = {message:reaction.detail}
	 	}
		reaction.i8n[this.locale].txt = "" // silent reaction
		return
	}

	expanded = this.msgResolution (longMsgId)

	if (expanded == "") {
		if (reaction.txt == undefined)
			expanded = "[" + longMsgId + "]"
		else
			expanded = "[" + reaction.txt + "]"
	}

	if (expanded == "[]") expanded = ""

	if (reaction.type == "rt_graph") {
		// to-do: parameters: by now, only one parameter to expand the text
		if (reaction.param != undefined) {
			expanded = this.expandParams (expanded,  {o1: reaction.param[0]})
		}
		reaction.i8n[this.locale].txt = expanded
    return
	}

	if (reaction.type == "rt_play_audio") {
     reaction.i8n[this.locale].txt = expanded
     return
	}

  if ((reaction.type == "rt_quote_begin") || (reaction.type == "rt_quote_continues")) {
		// dirty trick (to-do)
		expanded = this.expandParams (expanded,  {o1: reaction.param[0]})

		var itemExpanded = this.msgResolution ("items." + reaction.item + ".txt")
		if (itemExpanded == "") itemExpanded = reaction.item // in case of not defined

    reaction.i8n[this.locale].txt = ((reaction.type == "rt_quote_begin") ? "<br/><b>" + itemExpanded + "</b>: «": "" ) + expanded + ((reaction.last) ? "»" : "")
    return
	}

  if (reaction.type == "rt_end_game") {

		if (expanded == "") expanded = "End of game"
		// in case of a subgame, save returned state
		if ((typeof this.subgameId != 'undefined') && (this.subgameId != "")) expanded  += " (State: " + reaction.state + ")"
		if (this.connectionState == 0) {
			// save data
			this.runner.metaState.subgames[this.runner.metaState.subgameId].push ({state:reaction.state, data: reaction.data} )
			this.runner.metaState.history.push ({subgameId: this.runner.metaState.subgameId, state:reaction.state, data: reaction.data} )
			// current subgame reset
			this.runner.metaState.subgameId = ""

			// user must save the game now
			alert ("You ought to save the game in order to restart in the next module")
			// afterwards: metaDealer.js will decided which module follows

		}

		// it was: state.choice = {choiceId:'quit', action:{actionId:''}, isLeafe:true}
		this.choice = {choiceId:'quit', action:{actionId:''}, isLeafe:true}
		console.log ("end of game")

    reaction.i8n[this.locale].txt = expanded
    return

	}


  if (reaction.type == "rt_press_key")  {

		if (!reaction.alreadyPressed) {
			this.pendingPressKey = true
			this.pressKeyMessage = expanded
			/* it was:
			state.pendingPressKey = true
			state.pressKeyMessage = expanded
			*/
		}

		// to-do: make it language-dependent
		expanded = "<br/>"
		//expanded = "<br/>[...]<br/><br/>"


    reaction.i8n[this.locale].txt = expanded
    return
	}

	expanded = this.expandParams (expanded, reaction.param)

  reaction.i8n[this.locale].txt = expanded
  return

}

function messageTranslation (i8nMsg, type, id, attribute) {
	if (typeof i8nMsg.i8n == 'undefined') i8nMsg.i8n = {}
  if (typeof i8nMsg.i8n[this.locale] == 'undefined') i8nMsg.i8n[this.locale] = {}
  if (typeof i8nMsg.i8n[this.locale].txt == 'undefined') i8nMsg.i8n[this.locale].txt = ""
  if (i8nMsg.i8n[this.locale].txt != '') return // just done before

	i8nMsg.i8n[this.locale].txt = this.msgResolution (this.getLongMsgId (type, id, attribute))

}

function translateAll (locale, history, runner, translatedStuff) {

	this.locale = locale // to-do: eliminate global locale?

  // translation
	translatedStuff.PCState = JSON.parse(JSON.stringify(runner.PCState))
	if (typeof translatedStuff.PCState.profile.locMsg == 'undefined') translatedStuff.PCState.profile.locMsg = {}
	this.messageTranslation (translatedStuff.PCState.profile.locMsg, "items", translatedStuff.PCState.profile.locId, "txt")

  translatedStuff.history = history.slice()
  for (var h in translatedStuff.history ) {
		// echo
    this.actionTranslation (translatedStuff.history[h].action, true)
    for (var re in translatedStuff.history[h].reactionList ) {
      this.reactionTranslation (translatedStuff.history[h].reactionList[re])
    }
  }

	if (typeof runner.lastAction != 'undefined') {
			if (typeof translatedStuff.lastAction == 'undefined') {
				translatedStuff.lastAction = JSON.parse(JSON.stringify(runner.lastAction))
			}
			this.actionTranslation (translatedStuff.lastAction)
	}

  if (typeof runner.processedReactionList != 'undefined') {
    translatedStuff.processedReactionList = runner.processedReactionList.slice()
    //console.log ("Debug: " + JSON.stringify(runner.processedReactionList))
    for (var re in translatedStuff.processedReactionList ) {
      this.reactionTranslation (translatedStuff.processedReactionList[re])
    }
  }

	// error? previous translations are destroyed
  translatedStuff.choices = runner.choices.slice()
  for (var c in translatedStuff.choices ) {
    this.choiceTranslation (translatedStuff.choices[c])
  }

  var initialPressKeyMessage = runner.pressKeyMessage
  translatedStuff.pressKeyMessage  = {txt: initialPressKeyMessage}
  if (runner.pendingPressKey) {
		if (initialPressKeyMessage == "") {
			initialPressKeyMessage = "press_key"
		}
    this.messageTranslation (translatedStuff.pressKeyMessage, "messages", initialPressKeyMessage, "txt")
  }

  translatedStuff.menu = runner.menu.slice()
  for(var m in translatedStuff.menu) {
    this.messageTranslation (translatedStuff.menu[m], "messages", runner.menu[m].msg, "txt")
  }

	if (typeof runner.menuPiece != 'undefined') {
		if (typeof translatedStuff.menuPiece == 'undefined') {
			translatedStuff.menuPiece = JSON.parse(JSON.stringify(runner.menuPiece))
		}
		this.messageTranslation (translatedStuff.menuPiece, "items", translatedStuff.menuPiece.txt, "txt")
	}

}

function kTranslator (kMsg, param) {

	if (this.locale != "") {
		if (typeof this.kernelMessages != 'undefined') {
			if (typeof this.kernelMessages[kMsg] != 'undefined') {
				var textIn = this.kernelMessages[kMsg].message

				if (typeof param == "undefined") {
					return textIn
				} else {
					var textOut = this.expandParams (textIn, param)
					return textOut
				}


			}
		}
	}
	return "*" + kMsg + "*"
}

function buildSentence (textIn, expandedParams) {

	let textOut = " " + textIn

	for (let i=0; i<expandedParams.length;i++) {

		// calling the language dependent processor
		var modifiedText = lang_modules[this.locale].process(this, expandedParams[i])

		// replace code by language dependant word/s
		textOut = textOut.replace ("%" + expandedParams[i].code, modifiedText)

		// if explicit modifiers, clean final token
		if (expandedParams[i].modifiers != undefined) {
			textOut = textOut.replace ("_" + expandedParams[i].modifiers + "_" + expandedParams[i].code + "%", "")
		}

	}

	return textOut

}
