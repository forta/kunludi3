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
	setContext:setContext,
	addContext:addContext,
	addCommand:addCommand,
	setAliases:setAliases,
	translateContext:translateContext,
	commandExists:commandExists,
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
		showLog (3, "Locale "  + wrapperSt(localeIn) + " already added")
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

function addCommand (com) {
	let index = arrayObjectIndexOf (commandsPtr, "id", com)
	if (index >= 0) {
		showLog (3, "Command " + wrapperSt(com) + " already added in context")
		return
	}
	showLog (4, "Command " + wrapperSt(com) + " added in context")
	commandsPtr.push ({id:com, aliases:[]})
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

function commandExists (com) {
	let index = arrayObjectIndexOf (commandsPtr, "id", com)
	if (index < 0) {
		return false
	}
	return true
}

function getCommands () {
	let coms = []
	for (let c in commandsPtr) {
		coms.push (commandsPtr[c])
	}

	// to-do: by now
	showCommands()

	return coms
}

function showCommands (context) {
	console.log ("Module name: " + modName)
	console.log ("Commands:")
	for (let c in commandsPtr) {
		let aliasesStr = ""
		if (commandsPtr[c].aliases.length > 0) {
			aliasesStr = " (aliases:"
			for (let a in commandsPtr[c].aliases) {
				aliasesStr += " " + commandsPtr[c].aliases[a].id
			}
			aliasesStr += ")"
		}
		console.log ("\t" + c + "> " + commandsPtr[c].id + aliasesStr)
	}
	console.log ("Subcontexts:")
	for (let c in contextsPtr) {
		console.log ("\t" + c + "> " + contextsPtr[c].id)
	}
	console.log ("Locales:")
	for (let loc in locales) {
		console.log ("\t" + loc + "> " + locales[loc].id + ((localeIndex==loc)?"*":""))
	}

}

// initialization
(function() {
	addLocale ("en")
	setLocale ("en")
	// intrinsic commands
	//"set-context"
	//"set-locale"
	//"help"
	//"quit"
})();
