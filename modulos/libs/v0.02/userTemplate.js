"use strict";


let reactionList = [];
let primitives, libReactions
let offlineMode = false // detailed console.log only when offline game

/* Expose stuff */
// module.exports = exports = {
export default {
	dependsOn:dependsOn,
	processAction:processAction,
	itemMethod:itemMethod,
	actionIsEnabled:actionIsEnabled,
	turn:turn,
	executeCode:executeCode,
	getItem:getItem,
	getReaction:getReaction
}

function getItem (itemId) {
	var itemIndex = arrayObjectIndexOf(this.usr.items, "id", itemId);

	if (itemIndex>-1) {
		return this.usr.items[itemIndex]
	}

}

function getReaction (actionId) {
	var reactionIndex = arrayObjectIndexOf(this.usr.reactions, "id", actionId);

	if (reactionIndex>-1) {
		return this.usr.reactions[reactionIndex]
	}

}

function dependsOn (primitives, libReactions, reactionList) {
	this.primitives = primitives
	this.libReactions = libReactions
	this.reactionList = reactionList

	this.usr.lib = this.primitives
	this.usr.usr = this.usr
	this.usr.dependsOn (this.primitives, this.usr)

  this.usr.initReactions(primitives, this.usr)
  this.usr.initAttributes(primitives, this.usr)
	this.usr.initItems(primitives, this.usr)

}

function arrayObjectIndexOf(myArray, property, searchTerm) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

// external interface
function processAction (action) {

	let reaction = this.getReaction (action.actionId)
	if (reaction == undefined) {
		// this.reactionList.push ({type:"rt_msg", txt: 'Error: missing actionId on gReactions: ' + action.actionId} )
		return undefined
	}

	// to-do: verify again  if action is enabled
  if (offlineMode) {
		console.log ("game action: " +  JSON.stringify (action))
	}

	if (typeof reaction.reaction == 'function') {
		return reaction.reaction (action)
	}

	return
}

function itemMethod (itemId, methodName, params) {

	let item = this.getItems (itemId)
	if (item != undefined) {
	  return item[methodName](params)
	} else {
		console.log ("Error itemMethod: " + itemId + ", " + methodName )
	}

}


// external interface
function actionIsEnabled (actionId, item1, item2) {

	if (actionId == undefined) return undefined

	let reaction = this.getReaction (actionId)
	if (reaction == undefined) return undefined
	if (reaction.enabled == undefined) return undefined

	return reaction.enabled(item1, item2)

}

// // external interface, used by Links
function executeCode (functionName, par) {
	return this.usr.exec (functionName,par)
}

// GENERIC turn **********************************************************************************************

function turn (indexItem) {

	this.usr.turn (indexItem)

}
