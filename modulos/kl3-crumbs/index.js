let modName = ""
let locales = []
let logLevel = 3
let localeIndex = 0
let contextIndex
let commandsPtr, contextsPtr

module.exports = exports = { // commonjs
	setModName:setModName,
	getModName:getModName,
	addLocale:addLocale,
	setLocale:setLocale,
	cleanCommands:cleanCommands,
	setContext:setContext,
	addContext:addContext,
	addCommand:addCommand,
	setAliases:setAliases,
	translateContext:translateContext,
	contextExists:contextExists,
	commandResolution:commandResolution,
	getCommands:getCommands,
	showCommands:showCommands
}

function showLog(level, st) {
	if (level > logLevel) return
	console.log ("log#" + level + ": " + st)
}

function arrayObjectIndexOf(myArray, property, searchTerm) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

function wrapperSt(st) { return "<" + st + ">" }

/**************************************/

function text2HTML(text) {
  const convTable = {
    '\t': '&nbsp;&nbsp;&nbsp;&nbsp;',
    '\r\n': '<br>',
    '\r': '<br>',
    '\n': '<br>',
    '\"': '&quot;',
    '\&': '&amp;',
    '\<': '&lt;',
    '\>': '&gt;'
  };

  return text.replace(/[\t\r\n\"\<\>\&]/g, function(match) {
    return convTable[match];
  });
}

function showTextCR (htmlId, text) {
	if (text == "#clean#") {
	 	showText (htmlId, "#clean#")
		showText (htmlId, "\n")
	} else {
		showText	(htmlId, text + "\n")
	}
}

function showText (htmlId, text) {
	// to-do: \t -> &#9;
	// to-do: \n -> <br/>

  // Comprueba si se está ejecutando en un navegador
  if (typeof window !== 'undefined') {
    // Si es así, muestra la información en un elemento web
    const elemento = window.document.getElementById(htmlId);
		if (text == "#clean#") elemento.innerHTML = "";
    elemento.innerHTML += text2HTML(text);
  } else {
    // Si no, muestra la información por consola
    console.log(text);
  }
}

function getModName() {
  return modName
}

function setModName(modNameIn) {
  modName = modNameIn
	locales = []
	addLocale ("en")
}

function addLocale(localeIn) {
	showLog (4, "Adding locale " + wrapperSt(localeIn))
	let index = arrayObjectIndexOf (locales, "id", localeIn)
	if (index >= 0) {
		showLog (4, "Locale "  + wrapperSt(localeIn) + " already added")
		return
	}
	locales.push ({id:localeIn, commands: [], contexts:[]})
	index = arrayObjectIndexOf (locales, "id", localeIn)

	showLog (4, "Locale " + wrapperSt(localeIn) + " added with index " +  index)
}


function setLocale(localeIn) {
	let index = arrayObjectIndexOf (locales, "id", localeIn)
	if (index < 0) {
		showLog (3, "Missing locale "  + wrapperSt(localeIn))
		return
	}
	localeIndex = index
	contextsPtr = locales[localeIndex].contexts
	commandsPtr = locales[localeIndex].commands
}

function cleanCommands() {
	showLog (4, "Commands and contexts cleaned up")
	contextsPtr = locales[localeIndex].contexts = []
	commandsPtr = locales[localeIndex].commands = []
}

function setContext(contextIn) {
	let index = arrayObjectIndexOf (contextsPtr, "id", contextIn)
	if (index < 0) {
		showLog (3, "Missing contextIn "  + wrapperSt(contextIn))
		return
	}
	contextIndex = index
	commandsPtr = contextsPtr[contextIndex].commands
	showLog (4, "Context set to " + wrapperSt(contextIn))
}

function addContext(context) {
	showLog (4, "Adding context " + wrapperSt(context))
	let index = arrayObjectIndexOf (contextsPtr, "id", context)
	if (index >= 0) {
		showLog (3, "Context "  + wrapperSt(context) + " already added")
		return
	}
	contextsPtr.push ({id:context})
	index = arrayObjectIndexOf (contextsPtr, "id", context)

	showLog (4, "Context " + wrapperSt(context) + " added with index " +  index)
}

function addCommand (com, numPars) {
	numPars = typeof numPars !== "undefined" ? numPars : 0
	let index = arrayObjectIndexOf (commandsPtr, "id", com)
	if (index >= 0) {
		showLog (3, "Command " + wrapperSt(com) + " already added in context")
		return
	}
	showLog (4, "Command " + wrapperSt(com) + " added in context")
	commandsPtr.push ({id:com, numPars:numPars, aliases:[]})
}

function setAliases (com, aliases) {
	let index = arrayObjectIndexOf (commandsPtr, "id", com)
	if (index < 0) {
		showLog (3, "Command " + wrapperSt(com) + " does not exist in this context")
		return
	}

	let index2
	for (let a in aliases) {
		index2 = arrayObjectIndexOf (commandsPtr[index].aliases, "id", aliases[a])
		if (index2<0) {
			commandsPtr[index].aliases.push ({id:aliases[a]})
		} else {
			showLog (3, "Alias " + wrapperSt(aliases[a]) + " repeated in context for  command " + wrapperSt(com))
		}
	}

}

function translateContext (target, context, com, aliases) {

}

function contextExists (context) {
		if (arrayObjectIndexOf (contextsPtr, "id", context) < 0) return false
		return true

}

function commandResolution (com) {
	let index = arrayObjectIndexOf (commandsPtr, "id", com[0])
	let com0
	if (index < 0) {
		for(let i = 0, len = commandsPtr.length; i < len; i++) {
				for(let j = 0, len2 = commandsPtr[i].aliases.length; j < len2; j++) {
					if (commandsPtr[i].aliases[j].id === com[0]) {
						index = i
						com0= commandsPtr[i].id
						break
					}
				}
				if (index>=0) break
		}
	}

	if (index < 0) {
		showLog (4, "Wrong command " + com[0])
		return ""
	}

	if (commandsPtr[index].numPars != com.length - 1) {
		showLog (3, "The number of parameters was " + (com.length-1) + " but it should be " + commandsPtr[index].numPars)
		return ""
	}

	return commandsPtr[index].id
}

function getCommands () {
	let coms = []
	for (let c in commandsPtr) {
		coms.push (commandsPtr[c])
	}
	return coms
}

function showCommands (context) {

	showTextCR ("kl3-area", "#clean#")
	showTextCR ("kl3-area", "Module name: " + modName)
  showTextCR ("kl3-area", "Available commands:")
	for (let c in commandsPtr) {
		let aliasesStr = ""
		if (commandsPtr[c].aliases.length > 0) {
			aliasesStr = " (aliases:"
			for (let a in commandsPtr[c].aliases) {
				aliasesStr += " " + commandsPtr[c].aliases[a].id
			}
			aliasesStr += ")"
		}
		let numParsStr = (commandsPtr[c].numPars >0)? " (num pars: " + commandsPtr[c].numPars + ")": ""
		showTextCR ("kl3-area", "\t" + c + "> " + commandsPtr[c].id + numParsStr + aliasesStr)
	}
showTextCR ("kl3-area","Available subcontexts:")
	for (let c in contextsPtr) {
		showTextCR ("kl3-area","\t" + c + "> " + contextsPtr[c].id)
	}
	showTextCR ("kl3-area", "Available languages:")
	for (let loc in locales) {
		showTextCR ("kl3-area", "\t" + loc + "> " + locales[loc].id + ((localeIndex==loc)?"*":""))
	}

}

// initialization
(function() {
	addLocale ("en")
	setLocale ("en")
})();
