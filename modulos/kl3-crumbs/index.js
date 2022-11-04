let locales = []
let logLevel = 3
let localeIndex
let contextIndex
let contextsPtr // pointer to current context
let commandsPtr // pointer to contextsPtr[contextIndex].commands

module.exports = exports = { // commonjs
	setLocale:setLocale,
	addLocale:addLocale,
	setContext:setContext,
	goBack:goBack,
	addContext:addContext,
	addCommand:addCommand,
	setAliases:setAliases,
	translateContext:translateContext,
	selectCommand:selectCommand,
	showContext:showContext,
	showCommands:showCommands,
	showSubcontexts:showSubcontexts
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

function setLocale(localeIn) {
	let index = arrayObjectIndexOf (locales, "id", localeIn)
	if (index < 0) {
		showLog (3, "Missing locale "  + wrapperSt(localeIn))
		return
	}
	localeIndex = index
	contextsPtr = locales[localeIndex].contexts
}

function addLocale(localeIn) {
	showLog (4, "Adding locale " + wrapperSt(localeIn))
	let index = arrayObjectIndexOf (locales, "id", localeIn)
	if (index >= 0) {
		showLog (3, "Locale "  + wrapperSt(localeIn) + " already added")
		return
	}
	locales.push ({id:localeIn, contexts:[]})
	index = arrayObjectIndexOf (locales, "id", localeIn)

	showLog (4, "Locale " + wrapperSt(localeIn) + " added with index " +  index)
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

function goBack() {
	
}


function addContext(context) {
	showLog (4, "Adding context " + wrapperSt(context))
	let index = arrayObjectIndexOf (contextsPtr, "id", context)
	if (index >= 0) {
		showLog (3, "Context "  + wrapperSt(context) + " already added")
		return
	}
	contextsPtr.push ({id:context, previous:"?", commands:[], contexts:[]})
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


function selectCommand () {
	
}

function showContext () {
	
}

function showCommands (context) {
	console.log ("Commands of current context")
	for (let c in commandsPtr) {
		console.log ("\tCommand " + c + ": " + JSON.stringify(commandsPtr[c]))
	}
}

function showSubcontexts () {
	
}

// initialization
(function() {
	addLocale ("en")
	setLocale ("en")
	addContext("root")
	setContext("root")
})();
