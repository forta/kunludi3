/*

module that:
 1. isolizes access to this.world
 2. provides an interface to add reactions to this.reactionList

*/

"use strict";

let world;
let reactionList;
let userState;
let libFunctions = []
// dead code?: let hidenMessages = false;

let offlineMode = false // detailed console.log only when offline game

/* Expose stuff */

//module.exports = exports = {
export default {
	caMapping:caMapping,
	// executeGameAction:executeGameAction,
	dependsOn:dependsOn,
	exec:exec,
	out:out,
	arrayObjectIndexOf_2:arrayObjectIndexOf_2,
	isIndex:isIndex,

	initLibFunctions:initLibFunctions,

	CA_ShowDesc:CA_ShowDesc,
	CA_ShowStaticDesc:CA_ShowStaticDesc,

	CA_QuoteBegin:CA_QuoteBegin,
	CA_QuoteContinues:CA_QuoteContinues,
	CA_Refresh:CA_Refresh,
	CA_ShowMsg:CA_ShowMsg,
	CA_ShowMsgAsIs:CA_ShowMsgAsIs,
	CA_ShowDir:CA_ShowDir,
	CA_ShowItem:CA_ShowItem,
	CA_ShowMenu:CA_ShowMenu,
	CA_ShowImg:CA_ShowImg,
	CA_EnableChoices:CA_EnableChoices,
	CA_PressKey:CA_PressKey,
	CA_EndGame:CA_EndGame,
	CA_PlayAudio:CA_PlayAudio,

  PC_X:PC_X,
	PC_SetIndex:PC_SetIndex,
	PC_GetCurrentLoc:PC_GetCurrentLoc,
	PC_GetCurrentLocId:PC_GetCurrentLocId,
	PC_SetCurrentLoc:PC_SetCurrentLoc,
	PC_CheckCurrentLocId:PC_CheckCurrentLocId,
	PC_Points:PC_Points,
	PC_GetTurn:PC_GetTurn,
	PC_IsAt:PC_IsAt,

	DIR_GetIndex:DIR_GetIndex,
	DIR_GetId:DIR_GetId,

	IT_X:IT_X,
	IT_NumberOfItems:IT_NumberOfItems,
	IT_GetId:IT_GetId,
	IT_GetGameIndex:IT_GetGameIndex,
	IT_GetLoc:IT_GetLoc,
	IT_SetLocToLimbo:IT_SetLocToLimbo,
	IT_ReplacedBy:IT_ReplacedBy,
	IT_BringHere:IT_BringHere,
	IT_SetLoc:IT_SetLoc,
	IT_GetType:IT_GetType,
	IT_SetType:IT_SetType,
	IT_GetIsLocked:IT_GetIsLocked,
	IT_SetIsLocked:IT_SetIsLocked,
	IT_GetIsItemKnown:IT_GetIsItemKnown,
	IT_SetIsItemKnown:IT_SetIsItemKnown,
	IT_GetWhereItemWas:IT_GetWhereItemWas,
	IT_SetWhereItemWas:IT_SetWhereItemWas,
	IT_SetLastTime:IT_SetLastTime,
	IT_IsAt:IT_IsAt,
	IT_IsHere:IT_IsHere,
	IT_IsCarried:IT_IsCarried,
	IT_IsCarriedOrHere:IT_IsCarriedOrHere,
	IT_NumberOfAtts:IT_NumberOfAtts,
	IT_ATT:IT_ATT,
	IT_AttPropExists:IT_AttPropExists,

	IT_GetAttPropValueUsingId:IT_GetAttPropValueUsingId,
	IT_GetAttPropValue:IT_GetAttPropValue,

	IT_SetAttPropValue:IT_SetAttPropValue,
	IT_SetAttPropValueUsingId:IT_SetAttPropValueUsingId,

	IT_IncrAttPropValue:IT_IncrAttPropValue,
	IT_GetRandomDirectionFromLoc:IT_GetRandomDirectionFromLoc,
	IT_SameLocThan:IT_SameLocThan,
	IT_FirstTimeDesc:IT_FirstTimeDesc,

	W_GetAttIndex:W_GetAttIndex,

	GD_CreateMsg:GD_CreateMsg,
	GD_ResetLinks:GD_ResetLinks,
	GD_addLink:GD_addLink,

	MISC_Random:MISC_Random

}

function caMapping (type) {

	let reactionTypes = [
		"ASIS",
		"ATT",
		"ITEM",
		"MSG",
		"DESC",
 		"REFRESH",
 		"URL",
 		"GRAPH",
 		"GRAPH_POPUP",
 		"MSG_POPUP",
		"ENABLE_CHOICES",
 		"PRESS_KEY",
 		"SHOW_MENU",
 		"SOUND",
 		"ACTION",
 		"END_GAME",
 		"DIR",
 		"SHOW_ECHO",
 		"PLAY_AUDIO",
 		"QUOTE_BEGIN",
 		"QUOTE_CONTINUES",
		"DEV_MSG",
		"KERNEL_MSG"
	]

	// var pos = reactionTypes.indexOf (type);

	return "rt_" + type.toLowerCase();



}

function arrayObjectIndexOf(myArray, property, searchTerm) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

function arrayObjectIndexOf_2(myArray, property, searchTerm) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

function isIndex (indexOrId) {
		if ((indexOrId == -1) || (typeof indexOrId == "undefined")) return false
		return !isNaN(indexOrId)
}


function initLibFunctions (lib) {

	libFunctions.push ({
		id: 'setValue',
		code: function (par) { // par: id, value [, att]
			let parIn = (typeof par[0] == 'undefined') ? par : {id: par[0], value: par[1], att: par[2]}

			if (typeof parIn.att == "undefined") {
				lib.IT_SetAttPropValueUsingId (parIn.id, parIn.value)
			} else {
				lib.IT_SetAttPropValueUsingId (parIn.id + "." + parIn.att, parIn.value)
			}
		}
	});

	libFunctions.push ({
		id: 'getValue',
		code: function (par) { // par: id [, att]
			let parIn = (typeof par[0] == 'undefined') ? par : {id: par[0], att: par[1]}

			if (typeof parIn.att == "undefined") {
				return lib.IT_GetAttPropValueUsingId (parIn.id)
			} else {
				return lib.IT_GetAttPropValueUsingId (parIn.id + "." + parIn.att)
			}

		}
	});

	libFunctions.push ({
		id: 'getLoc',
		code: function (par) { // par: item
			let parIn = (typeof par[0] == 'undefined') ? par : {item: par[0]}
			if (!isIndex (parIn.item)) parIn.item = lib.IT_X(parIn.item)
			return lib.IT_GetLoc (parIn.item)
		}
	});

	libFunctions.push ({
		id: 'itemIsAt',
		code: function (par) { // par: item, loc
			let parIn = (typeof par[0] == 'undefined') ? par : {item: par[0], loc: par[1]}
			if (!isIndex (parIn.item)) parIn.item = lib.IT_X(parIn.item)
			if (!isIndex (parIn.loc)) parIn.loc = lib.IT_X(parIn.loc)
			return (lib.IT_GetLoc (parIn.item) == parIn.loc )
		}
	});

	libFunctions.push ({
		id: 'isHere',
		code: function (par) { // par: item
			let parIn = (typeof par[0] == 'undefined') ? par : {item: par[0]}
			if (!isIndex (parIn.item)) parIn.item = lib.IT_X(parIn.item)
			return lib.IT_IsHere(parIn.item)
		}
	});

	libFunctions.push ({
		id: 'isCarried',
		code: function (par) { // par: item
			let parIn = (typeof par[0] == 'undefined') ? par : {item: par[0]}
			if (!isIndex (parIn.item)) parIn.item = lib.IT_X(parIn.item)
			return lib.IT_IsCarried(parIn.item)
		}
	});

	libFunctions.push ({
		id: 'setLoc',
		code: function (par) { // par: item1, item2
			let parIn = (typeof par[0] == 'undefined') ? par : {item1: par[0], item2: par[1]}
			if (!isIndex (parIn.item1)) parIn.item1 = lib.IT_X(parIn.item1)
			if (!isIndex (parIn.item2)) parIn.item2 = lib.IT_X(parIn.item2)
			lib.IT_SetLoc (parIn.item1, parIn.item2)
		}
	});

	libFunctions.push ({
		id: 'pcSetLoc',
		code: function (par) { // par: item
			let parIn = (typeof par[0] == 'undefined') ? par : {item: par[0]}
			if (!isIndex (parIn.item)) parIn.item = lib.IT_X(parIn.item)
			lib.PC_SetCurrentLoc(parIn.item)
		}
	});

	libFunctions.push ({
		id: 'getLocId',
		code: function (par) { // par: id
			let parIn = (typeof par[0] == 'undefined') ? par : {id: par[0]}
			let item = lib.IT_GetLoc (parIn.id)
			if (item<0) return
			return lib.world.items[item].loc
		}
	});

	libFunctions.push ({
		id: 'x',
		code: function (par) { // par.id
			let parIn = (typeof par[0] == 'undefined') ? par : {id: par[0]}
			return lib.IT_X (parIn.id)
		}
	});

	libFunctions.push ({
		id: 'getDir',
		code: function (par) {  // par.dirId
			let parIn = (typeof par[0] == 'undefined') ? par : {dirId: par[0]}
			return lib.DIR_GetIndex(parIn.dirId)
		}
	});

	libFunctions.push ({
		id: 'pc',
		code: function () {
			return lib.PC_X ()
		}
	});

	libFunctions.push ({
		id: 'pc.loc',
		code: function () {
			return lib.PC_GetCurrentLoc()
		}
	});

}


function dependsOn (worldPar, reactionListPar, userStatePar, metaDealer, metaState) {
	this.world = worldPar;
	this.reactionList = reactionListPar;
	this.userState = userStatePar;
	this.metaDealer = metaDealer;
	this.metaState = metaState;
	this.initLibFunctions(this)


};

function exec (functionName, par) {

	let indexLibFunction = this.arrayObjectIndexOf_2(libFunctions, "id", functionName);
	if (indexLibFunction<0) {
		console.log ("missing functionName [" + functionName + "] in executeCode")
		return
	}
  return libFunctions[indexLibFunction].code (par)

}

function out (typeId, par) { // temp
	let parIn
	// mapping
	if (typeId == "showMsg") {
		parIn = (typeof par[0] == 'undefined') ? par : {txt: par[0], param: par[1], displayOptions: par[2]}
		return this.CA_ShowMsg (parIn.txt, parIn.param, parIn.displayOptions)
	}
	//else
	// here!! to-do
	if (typeId == "PressKey") {
		parIn = (typeof par[0] == 'undefined') ? par : {txt: par[0]}
		return this.CA_PressKey (parIn.txt)
	} else if (typeId == "ShowDesc") {
		parIn = (typeof par[0] == 'undefined') ? par : {txt: par[0]}
		return this.CA_ShowDesc (parIn.txt)
	} else if (typeId == "EnableChoices") {
		parIn = (typeof par[0] == 'undefined') ? par : {txt: par[0]}
		return this.CA_EnableChoices (parIn.txt)
	} else if (typeId == "EndGame") {
		parIn = (typeof par[0] == 'undefined') ? par : {txt: par[0]}
		return this.CA_EndGame (parIn.txt)
	} else if (typeId == "QuoteBegin") {
		parIn = (typeof par[0] == 'undefined') ? par : {txt: par[0]}
		return this.CA_QuoteBegin (parIn.txt)
	} else if (typeId == "Refresh") {
		parIn = (typeof par[0] == 'undefined') ? par : {txt: par[0]}
		return this.CA_Refresh (parIn.txt)
	}


}

// -----------------------------------

/*(begin)********************** INSTRUCTION SET *********************
They are just a interface of macros for cleaner code
Categories:
 CA: Client Action

  CA_ShowDesc (o1)
	CA_ShowStaticDesc (o1)
  CA_QuoteBegin (i)
  CA_QuoteContinues ()
  CA_Refresh ()
  CA_ShowMsg (txt[,o1[,o2]])
  CA_ShowMsgAsIs (txt)
  CA_ShowItem (o1)
  CA_ShowMenu ( menu, piece)
  CA_ShowImg (url)
	CA_EnableChoices (value)
  CA_PressKey (txt)
  CA_EndGame ()
  CA_RestartGame ()
  CA_PlayAudio (fileName, autoStart, txt)

 PC: Playing Character

  PC_X()
  PC_SetIndex(o1)
  PC_GetCurrentLoc ()
  PC_GetCurrentLocId ()
  PC_SetCurrentLoc (o1)
  PC_CheckCurrentLocId (locId)
  PC_Points (value)
  PC_GetTurn()
  PC_IsAt (i)

 DIR: Directions

  DIR_GetIndex (id)
  DIR_GetId (index)

 IT: items

  IT_X(id)
  IT_NumberOfItems ()
  IT_GetId (index)
  IT_GetGameIndex (i)
  IT_GetLoc (i)
  IT_SetLocToLimbo (i)
  IT_ReplacedBy (i1, i2)
  IT_BringHere (i)
  IT_SetLoc (i, value)
  IT_GetType (i)
  IT_SetType (i, value)
  IT_GetIsLocked (i, dir)
  IT_SetIsLocked (i, dir, value)
  IT_GetIsItemKnown (i1, i2)
  IT_SetIsItemKnown (i1, i2)
  IT_GetWhereItemWas(i1, i2)
  IT_GetWhereItemWas(i1, i2)
  IT_SetWhereItemWas(i1, i2, value)
  IT_SetLastTime(i1, i2)
  IT_IsAt (i, l)
  IT_IsHere (i)
  IT_IsCarried(i)
  IT_IsCarriedOrHere(i)
  IT_NumberOfAtts(i)
  IT_ATT (indexItem, idAttType)
  IT_AttPropExists (indexItem, attId, propId)

  IT_GetAttPropValue (indexItem, attId, propId)
	IT_GetAttPropValueUsingId (itemId | itemId.att)

  IT_SetAttPropValue (indexItem, attId, propId, newValue)
	IT_SetAttPropValueUsingId (itemId | itemId.att, value)

  IT_IncrAttPropValue (indexItem, attId, propId, increment)

  IT_GetRandomDirectionFromLoc(indexLoc)
  IT_SameLocThan(i1,i2)

  IT_FirstTimeDesc(indexItem) // no IT_

 W: world ??

  W_GetAttIndex(id)

 GD: Game Definition

  GD_CreateMsg (indexLang, idMsg, txtMsg)

	GD_DefAllLinks (linkArray)
	GD_addLink

	MISC:

  MISC_Random (num)
	MISC_HideMessages (boolean)

 Auxiliary functions (internals):

  getTargetAndLocked (par_c)

*/

/* CA: Client Action *****************************************************************/

function CA_ShowDesc  (o1) {
 this.reactionList.push ({type:this.caMapping("DESC"), o1:o1, o1Id:this.world.items[o1].id});
};

function CA_ShowStaticDesc  (loc) {
	this.reactionList.push ({type:this.caMapping("MSG"), txt:this.world.items[loc].id + ".desc"});
}

function CA_QuoteBegin  (item, txt, param, last) {
 if (typeof param == "undefined") param = [];
 if (typeof last == "undefined") last = true;

 this.reactionList.push ({type:this.caMapping("QUOTE_BEGIN"), item:item, txt:txt, param:param, last:last});
}

function CA_QuoteContinues  (txt, param, last) {
 if (typeof param == "undefined") param = [];
 if (typeof last == "undefined") last = true;

 this.reactionList.push ({type:this.caMapping("QUOTE_CONTINUES"), txt:txt, param:param, last:last});
}

function CA_Refresh () {
 this.reactionList.push ({type:this.caMapping("REFRESH")});
}

function CA_ShowMsg (txt, param, displayOptions) {

	var visible, visibleBy // visible: true by default; visibleBy undefined by default

	if (typeof displayOptions == "object") {
		if (typeof displayOptions.visibleBy != "undefined") {
			let visibleWithoutPrefix = displayOptions.visibleBy, value
			if (displayOptions.visibleBy[0] == "!") {
				visibleWithoutPrefix = visibleWithoutPrefix.substring(1)
			}
			value = this.IT_GetAttPropValueUsingId (visibleWithoutPrefix)
			if (displayOptions.visibleBy[0] != "!") {
				visible = (value > 0) ? false: true // game variable must be grater than 0 to hide the message
			} else {  // "!"
				visible = (value > 0) ? true: false // game variable must be grater than 0 to show the message
			}
			
			if (offlineMode) {
				console.log ("visibleBy value: " + value)
			}

		} else {
			visible = (typeof displayOptions.visible == "undefined") ? true : displayOptions.visible
		}
	} else { // if displayOptions is a value, it the value for visible
		visible = (typeof displayOptions == "undefined") ? true : displayOptions
	}

  var id = this.reactionList.length
  // to-do: this is a temp trick
  if (param != undefined) {
		// console.log ("<KL>Param in CA_ShowMsg: " + JSON.stringify (param))
		if (param.o1 != undefined) {
			  if (offlineMode) {
					console.log ("<KL>Param.o1 in CA_ShowMsg: " + param.o1)
				}
				if  (!isNaN(parseFloat(param.o1)) && isFinite(param.o1)) {
					param.o1 = this.world.items[param.o1].id
				}
		} else if (param.l1 != undefined) {
			//console.log ("link defined: " + JSON.stringify(param) )


			this.reactionList.push ({type:this.caMapping("MSG"), txt:txt + "_pre", visible:visible, id:id});
			this.reactionList.push ({type:this.caMapping("LINK"), txt:param.txt, param:param, visible:visible, id:id});
			this.reactionList.push ({type:this.caMapping("MSG"), txt:txt + "_post", visible:visible, id:id});

		  return id
		}
  }

 this.reactionList.push ({type:this.caMapping("MSG"), txt:txt, param:param, visible:visible, id: this.reactionList.length, id:id});
 return id
}

function CA_ShowMsgAsIs (txt) {
	var id = this.reactionList.length
  this.reactionList.push ({type:this.caMapping("ASIS"), txt:txt, visible:true, id:id});
  return id
}

function CA_ShowDir ( dir) {
 this.reactionList.push ({type:this.caMapping("DIR"), dir:dir});
}

function CA_ShowItem ( o1) {
 // o1Id!
 this.reactionList.push ({type:this.caMapping("ITEM"), o1:o1, o1Id:this.world.items[o1].id});
}

function CA_ShowMenu ( menu, menuPiece) {

 if (menuPiece != undefined) {
	  console.log ("MenuPiece: " + JSON.stringify (menuPiece))
 }

  this.reactionList.push ({type:this.caMapping("SHOW_MENU"), menu:menu, menuPiece:menuPiece});
}

function CA_ShowImg (url, isLocal, isLink, txt, param, visible) {

	var id = this.reactionList.length

	this.reactionList.push ({
		id: id,
		type:this.caMapping("GRAPH"),
		url:url,
		isLocal: (typeof isLocal == "undefined")? false : isLocal,
		isLink: (typeof isLink == "undefined")? false: isLink,
		txt:(typeof txt == "undefined")? "": txt,
		param: param,
		visible:(typeof visible == "undefined")? true: visible
	});

	return id
}

function CA_EnableChoices (value) {
	this.reactionList.push ({type:this.caMapping("ENABLE_CHOICES"), value:value});
}

function CA_PressKey (txt) {
	this.reactionList.push ({type:this.caMapping("PRESS_KEY"), txt:txt, pressed:false});
}

function CA_EndGame (txt, state, data) {
 this.reactionList.push ({type:this.caMapping("END_GAME"), txt:txt, state:state, data:data});
 }

function CA_PlayAudio (fileName, autoStart, txt, param) {

 this.reactionList.push ({type:this.caMapping("PLAY_AUDIO"), fileName:fileName, autoStart:autoStart, txt:txt, param:param });

}


/* PC: Playing Character *****************************************************************/

function PC_X () {
 return this.userState.profile.indexPC;
}

function PC_SetIndex (o1) {
 this.userState.profile.indexPC = o1;
 if (this.userState.profile.indexPC<0) {
  console.log ("Error in PC_SetIndex(o1): o1(== " +  o1 + ") is < 0");
  return;
 }
}

function PC_GetCurrentLoc () {
 var locId = this.world.items[this.userState.profile.indexPC].loc;
 return this.IT_X (locId);
}

function PC_GetCurrentLocId () {
 return this.world.items[this.userState.profile.indexPC].loc;
}

function PC_SetCurrentLoc  (indexItem) {
 this.world.items[this.userState.profile.indexPC].loc = this.world.items[indexItem].id;
}

function PC_CheckCurrentLocId  (locId) {
 var i =  this.IT_X (locId)

 return ((this.IT_GetLoc(i)  == this.PC_X()) || (this.IT_GetLoc(i) == this.PC_GetCurrentLoc()));

}

// score increment
function PC_Points  (value) {
 // to-do: as att?: var scoreInc = +IT_GetAttPropValue (this.userState.profile.indexPC, "score", "state");
 this.userState.profile.score += value;
}

function PC_GetTurn  () {
 return this.userState.profile.turnCounter;
}

function PC_IsAt  (i) {
	return (this.IT_X (this.world.items[this.userState.profile.indexPC].loc) == i)
}


/* DIR: directions *****************************************************************/

function DIR_GetIndex  (id) {
 return arrayObjectIndexOf(this.world.directions, "id", id);
}

function DIR_GetId  (index) {
 if (index>=0) return this.world.directions[index].id;
}

/* IT: items *****************************************************************/

function IT_X (id){

  let parts = id.split(".")
  return arrayObjectIndexOf(this.world.items, "id", parts[0]);
}

function IT_NumberOfItems  () {
 return this.world.items.length;
}


function IT_GetId  (index) {
 if (index>=0) return this.world.items[index].id;
}

function IT_GetGameIndex  (index) {
 return this.worldIndexes.items[index].gameIndex;
}


function IT_GetLoc  (indexOrId) {
	let locId = isIndex(indexOrId) ? this.world.items[indexOrId].loc: indexOrId
  return arrayObjectIndexOf(this.world.items, "id", locId);
}

function IT_SetLocToLimbo  (i) {
 var value = this.IT_X ("limbo");
 this.world.items[i].loc = this.world.items[value].id;
}

//  i2 where i1 was; i1 to limbo
function IT_ReplacedBy (i1, i2) {
 this.world.items[i2].loc = this.world.items[i1].loc;
 this.world.items[i1].loc = "limbo";
}

function IT_BringHere (i) {
 this.world.items[i].loc = this.world.items[this.PC_GetCurrentLoc()].id;
}

function IT_SetLoc (i, value) {
  if (i<0) { console.log ("Error in IT_SetLoc item1"); return	}
	if (value<0) { console.log ("Error in IT_SetLoc item2"); return	}
  this.world.items[i].loc = this.world.items[value].id;
}

function IT_GetType (i) {
 return this.world.items[i].type;
}

function IT_SetType (i, value) {
 this.world.items[i].type = value;
}

function IT_GetIsLocked (i, dir) {
 for (var d in this.world.items[i].address) {
  if (this.world.items[i].address[d].dir  == dir) {
   if (typeof this.world.items[i].address[d].locked != "undefined") {
    return this.world.items[i].address[d].locked;
   } else {
    return false;
   }
  }
 }

 return false;
}

function IT_SetIsLocked (i, dir, value) {
 for (var d in this.world.items[i].address) {
  if (this.world.items[i].address[d].dir == dir) {
   this.world.items[i].address[d].locked = value;
   return;
  }
 }
}

function IT_GetIsItemKnown (i1, i2) {
	 return (arrayObjectIndexOf(this.world.items[i1].state.itemsMemory, "itemIndex", i2) >= 0)
}

function IT_SetIsItemKnown (i1, i2) {
	var pos = arrayObjectIndexOf(this.world.items[i1].state.itemsMemory, "itemIndex", i2)
	if (pos < 0) {
		this.world.items[i1].state.itemsMemory.push ( {itemIndex: i2, whereWas:-1, lastTime:-1 } )
	} else {
		this.world.items[i1].state.itemsMemory[pos] = {itemIndex: i2, whereWas:-1, lastTime:-1 }
	}
}

function IT_GetWhereItemWas (i1, i2) {
	var pos = arrayObjectIndexOf(this.world.items[i1].state.itemsMemory, "itemIndex", i2)
	if (pos < 0) return "limbo"; // it could be undefined
	return  this.world.items[i1].state.itemsMemory[pos].whereWas;
}

function IT_SetWhereItemWas (i1, i2, value) {
	var pos = arrayObjectIndexOf(this.world.items[i1].state.itemsMemory, "itemIndex", i2)
	if (pos < 0) this.IT_SetIsItemKnown (i1,i2)
	pos = arrayObjectIndexOf(this.world.items[i1].state.itemsMemory, "itemIndex", i2)
  this.world.items[i1].state.itemsMemory[pos].whereWas = value;
  this.IT_SetLastTime(i1, i2);
}

function IT_SetLastTime (i1, i2) {
	var pos = arrayObjectIndexOf(this.world.items[i1].state.itemsMemory, "itemIndex", i2)
  this.world.items[i1].state.itemsMemory[pos].lastTime = this.userState.profile.turnCounter;
}

function IT_IsAt  (i, l) {
 return (this.IT_GetLoc(i) == l);
}

function IT_IsHere  (i) {
 return (this.IT_GetLoc(i) == this.PC_GetCurrentLoc());
}

function IT_IsCarried (i) {
 return (this.IT_GetLoc(i)  == this.PC_X());
}

// to-do:  IT_IsCarriedOrHere -> IT_OnCarriedOrHere
function IT_IsCarriedOrHere (i) {
 return ((this.IT_GetLoc(i)  == this.PC_X()) || (this.IT_GetLoc(i) == this.PC_GetCurrentLoc()));
}

 function IT_NumberOfAtts (i) {
 if (typeof this.world.items[i].att == "undefined") return 0;
 return this.world.items[i].att.length;
}

function IT_ATT (indexItem, idAttType) { // if exists definition

 if (indexItem<0) return false; // preventive
 var indexAttType = arrayObjectIndexOf(this.world.attributes, "id", idAttType);
 if (indexAttType  == -1) return false;

 if (typeof this.world.items[indexItem].att == "undefined") return false;
 if (typeof this.world.items[indexItem].att[idAttType] == "undefined") return false;
 return true;
}

function IT_AttPropExists (indexItem, attId, propId) {
 if (typeof this.world.items[indexItem].att == "undefined") return false;
 if (typeof this.world.items[indexItem].att[attId] == "undefined") return false;

 var j = arrayObjectIndexOf(this.world.items[indexItem].att[attId], "id", propId);
 return (j>=0);
}

function IT_GetAttPropValueUsingId (itemAtt) {  // itemAtt: item.att.state, or item[.generalState.state]
	let parts = itemAtt.split(".")

	let item = isNaN(parts[0])? this.IT_X(parts[0]) : parts[0] // if part[0] is already a number, use it
	let attId, propId

	if (parts.length == 3) {
		attId = parts[1]
		propId = parts[2]
	} else {
		attId = "generalState"
		propId = "state"
	}

	return this.IT_GetAttPropValue(item, attId, propId)

}


function IT_GetAttPropValue (indexItem, attId, propId) {

 for (let i=0; i<this.world.items[indexItem].att[attId].length;i++) {

  // to-do: two versions!
  if (this.world.items[indexItem].att[attId][i].id == propId) {
   return this.world.items[indexItem].att[attId][i].value;
  } else if (typeof this.world.items[indexItem].att[attId][i][propId] != 'undefined') {
   return this.world.items[indexItem].att[attId][i][propId];
  }
 }

}

function IT_SetAttPropValueUsingId (itemAtt, value) {
	let parts = itemAtt.split(".")
	let item = this.IT_X(parts[0])
	let attId, propId

	if (parts.length == 3) {
		attId = parts[1]
		propId = parts[2]
	} else {
		attId = "generalState"
		propId = "state"
	}

	return this.IT_SetAttPropValue(item, attId, propId, value)


}

function IT_SetAttPropValue (indexItem, attId, propId, newValue) {

	// console.log ("IT_SetAttPropValue. indexItem: " + indexItem + ",attId: " + attId + ",propId: " + propId + ", newValue: " + newValue)

 // find j in this.world.items[indexItem].att[attId][i][propId]
 for (var i=0; i<this.world.items[indexItem].att[attId].length;i++) {
  // to-do: two versions!
  if (this.world.items[indexItem].att[attId][i].id == propId) {
   this.world.items[indexItem].att[attId][i].value = newValue;
   return;
  } else if (typeof this.world.items[indexItem].att[attId][i][propId] != 'undefined') {
   this.world.items[indexItem].att[attId][i][propId] = newValue;
   return;
  }
 }
}

function IT_IncrAttPropValue (indexItem, attId, propId, increment) {
 var incNumber = +increment;

 // find j in this.world.items[indexItem].att[attId][i][propId]
 for (var i=0; i<this.world.items[indexItem].att[attId].length;i++) {
  // to-do: two versions!
  if (typeof this.world.items[indexItem].att[attId][i].id == propId) {
   this.world.items[indexItem].att[attId][i].value =
    +this.world.items[indexItem].att[attId][i].value + incNumber;
   return;
  } else if (typeof this.world.items[indexItem].att[attId][i][propId] != 'undefined') {
   this.world.items[indexItem].att[attId][i][propId] =
    +this.world.items[indexItem].att[attId][i][propId] + incNumber;
   return;
  }
 }
}

function IT_GetRandomDirectionFromLoc (indexLoc) {

 // to-do: pending to repare
 return
 var table = ludi_runner.getCSExits(indexLoc);

 if (table.length  == 0) return null;
 var i = MISC_Random (table.length);
 return {dir:table[i].dir, target:table[i].target};

}

function IT_SameLocThan (i1, i2) {
 if (i1<0) return false;
 if (i2<0) return false;
 return (IT_GetLoc(i1) == IT_GetLoc(i2));

}

// if returns true, ordinary desc will be needed after it
function IT_FirstTimeDesc (indexItem) {
 // vue by now:
 return true

 var itemWorlIndex = this.worldIndexes.items[indexItem];

 if (itemWorlIndex.gameIndex>=0)  {
  // if exists game item firstDesc()
  if (typeof ludi_game.items[itemWorlIndex.gameIndex].firstDesc == 'function') {
   var state=ludi_game.items[itemWorlIndex.gameIndex].firstDesc();
   return ((state) || ( state == undefined));
  }

 }
 return true;

}


/* W: World *****************************************************************/

function W_GetAttIndex (id) {
 return arrayObjectIndexOf(this.world.attributes, "id", id);
}

/* GD: Game Definition *****************************************************************/

// note: for use during game development
function GD_CreateMsg (lang, idMsg, txtMsg) {
	if (txtMsg.indexOf ("%l1") == -1) {
			this.reactionList.push ({type:this.caMapping("DEV_MSG"), lang:lang, txt:idMsg, detail:txtMsg});
	} else {
		var substring = txtMsg.split ("%l1")
		this.reactionList.push ({type:this.caMapping("DEV_MSG"), lang:lang, txt:idMsg + "_pre", detail:substring[0]});
		this.reactionList.push ({type:this.caMapping("DEV_MSG"), lang:lang, txt:idMsg + "_post", detail:substring[1]});
	}

}

function	addDetailedSubreactionToLink (reactionList, reactionListId, subReaction) {
	// add the subREaction
  for (var k=0; k<reactionList.length;k++) {
		if (typeof reactionList[k].id != "undefined" ) {
			if ((reactionList[k].id == reactionListId) && (reactionList[k].type == "rt_link")){
				// reactionList[k].active = true
				if (typeof reactionList[k].param.l1.subReactions == "undefined") {reactionList[k].param.l1.subReactions = []}

				var subReaction2=JSON.parse(JSON.stringify(subReaction)); // to avoid strange behaviour (because of "var")
				reactionList[k].param.l1.subReactions.push (subReaction2)
			}
		}
	}
}

function GD_addLink (linkDef) {

  let reactionListId = linkDef.id

	// index of reactionListId in reactionList, if it is a link
	let rIndex
	for (rIndex=0; rIndex<this.reactionList.length;rIndex++) {
		if (typeof this.reactionList[rIndex].id != "undefined" ) {
			if ((this.reactionList[rIndex].id == reactionListId) && (this.reactionList[rIndex].type == "rt_link")) {
				break
			}
		}
	}

	// link activation
	this.reactionList[rIndex].active = true

  // for each attribute but id
	const props = Object.getOwnPropertyNames(linkDef)
	for (let px=0;px<props.length; px++) {
		if (props[px] == "id") continue
		let type = props[px]

		// completing especific data for each subReaction
	  let subReaction = {type: type}

	 	console.log ("reactionListId: " + reactionListId + ", type: " + type)

	  if (type == "url") {
		  subReaction.url = linkDef.url
			addDetailedSubreactionToLink (this.reactionList, reactionListId, subReaction)

		} else if (type == "libCode") {
		  subReaction.functionId = linkDef.libCode.functionId
			subReaction.par = linkDef.libCode.par
			addDetailedSubreactionToLink (this.reactionList, reactionListId, subReaction)

		} else if (type == "userCode") {
			subReaction.functionId = linkDef.userCode.functionId
			subReaction.par = linkDef.userCode.par
			addDetailedSubreactionToLink (this.reactionList, reactionListId, subReaction)

		} else if (type == "visibleToTrue") {
	  	subReaction = {type: "visible"}
		  for (var j=0; j<linkDef.visibleToTrue.length;j++) {
				subReaction.rid = linkDef.visibleToTrue[j]
				subReaction.visible = true
				addDetailedSubreactionToLink (this.reactionList, reactionListId, subReaction)
			}

		} else if (type == "visibleToFalse") {
	  	subReaction = {type: "visible"}
		  for (var j=0; j<linkDef.visibleToFalse.length;j++) {
				subReaction.rid = linkDef.visibleToFalse[j]
				subReaction.visible = false
				addDetailedSubreactionToLink (this.reactionList, reactionListId, subReaction)
			}

		} else if (type == "changeTo") {
	    subReaction = {type: "visible"}
		  subReaction.rid = linkDef.changeTo
		  subReaction.visible = true
		  addDetailedSubreactionToLink (this.reactionList, reactionListId, subReaction)
		  // self hidden
		  subReaction = {type: "visible"}
		  subReaction.rid = reactionListId
		  subReaction.visible = false
		  addDetailedSubreactionToLink  (this.reactionList, reactionListId, subReaction)

		} else if (type == "activatedBy") {
		  // to-do: if activatedBy exists, the pointed variable should be used to set whether it's active or not
			if (offlineMode) {
				console.log ("ActivatedBy?: " + JSON.stringify (linkDef))
			}

			/*
			let item = this.IT_X (linkDef.activatedBy)
			let value = this.IT_GetAttPropValue (item, "generalState", "state")
			*/

			let value = this.IT_GetAttPropValueUsingId (linkDef.activatedBy)

			if (offlineMode) {
				console.log ("Value: " + value)
			}

			// game variable must be grater than 0
			if (value > 0) {
				this.reactionList[rIndex].active = false
			}

			// to-do: ??
			subReaction = {type: "activatedBy"}
			subReaction.activatedBy = linkDef.activatedBy
			addDetailedSubreactionToLink  (this.reactionList, reactionListId, subReaction)

		} else if (type == "action") {
			// console.log ("link def (action): " + JSON.stringify(linkDef.action))
			subReaction = {type: "action", choiceId: linkDef.action.choiceId}

			// parm validation
			let validation = true
			if (subReaction.choiceId == "dir1") {
				// params: d1, d1Id, target, targetId
				if (typeof linkDef.action.d1 == "undefined") {validation = false}
				else {subReaction.d1 = linkDef.action.d1}
				if (typeof linkDef.action.d1Id == "undefined") {validation = false}
				else {subReaction.d1Id = linkDef.action.d1Id}
				if (typeof linkDef.action.target == "undefined") {validation = false}
				else {subReaction.target = linkDef.action.target}
				if (typeof linkDef.action.targetId == "undefined") {validation = false}
				else {subReaction.targetId = linkDef.action.targetId}
				// param: targetId
				if (typeof linkDef.action.targetId == "undefined") {validation = false}
				else {subReaction.targetId = linkDef.action.targetId}
			} else if ((subReaction.choiceId == "obj1") || (subReaction.choiceId == "action0") ||  (subReaction.choiceId == "action") ||  (subReaction.choiceId == "action2") ) {
				// param: actionId
				if ((subReaction.choiceId == "action0") ||  (subReaction.choiceId == "action") ||  (subReaction.choiceId == "action2") ) {
					if (typeof linkDef.action.actionId == "undefined") {validation = false}
					else subReaction.actionId = linkDef.action.actionId
				}

				// param o1Id
				if ((subReaction.choiceId == "obj1") ||  (subReaction.choiceId == "action") ||  (subReaction.choiceId == "action2") ) {
					if (typeof linkDef.action.o1Id == "undefined") {validation = false}
					else {
						subReaction.o1Id = linkDef.action.o1Id
						subReaction.o1 = this.IT_X (subReaction.o1Id)
					}
					//param parent
					if (subReaction.choiceId == "obj1") {subReaction.parent = "here"} // to-do
				}
				// param o2Id
				if (subReaction.choiceId == "action2") {
					if (typeof linkDef.action.o2Id == "undefined") {validation = false}
					else {
						subReaction.o2Id = linkDef.action.o21Id
						subReaction.o2 = this.IT_X (subReaction.o2Id)
					}
				}
			} else {
				validation = false
		  }

			if (validation) {
				addDetailedSubreactionToLink (this.reactionList, reactionListId, subReaction)
			} else  {
				console.log ("error on param of link def")
			}

		} else {
			console.log ("Erro: reactionListId: " + reactionListId + ", type: " +  type)
		}

	}
}


function GD_ResetLinks () {

	//console.log ("Definition of links: " + JSON.stringify(linkArray))

	// clear data: deactivate links and clean subReactions
	for (let k=0; k<this.reactionList.length;k++) {
		if (typeof this.reactionList[k].id != "undefined" ) {
			if (this.reactionList[k].type == "rt_link"){
				this.reactionList[k].active = false
				this.reactionList[k].param.l1.subReactions = []
			}
		}
	}

}



/* MISC: facilities *****************************************************************/


 function MISC_Random (num) {
   return Math.floor((Math.random() * (+num)));
 }


/*(end)********************** INSTRUCTION SET *********************/
