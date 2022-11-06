// references to external modules
let libReactions, gameReactions, reactionList

let debugMode = false
let offlineMode = false // detailed console.log only when offline game

////export
let choice = {choiceId:'top', isLeafe:false, parent:''}

/* Expose stuff */

// module.exports = exports = { //commonjs
export default {
	dependsOn:dependsOn,
	createWorld:createWorld,
	processCode:processCode,
	execLink:execLink,
	processChoice:processChoice,
	processAction:processAction,
	actionIsEnabled:actionIsEnabled,
	getTargetAndLocked:getTargetAndLocked,
	updateChoices:updateChoices,
	getCurrentChoice:getCurrentChoice,
	getGameTurn:getGameTurn,
	getEnableChoices:getEnableChoices,
	setEnableChoices:setEnableChoices,
	keyPressed:keyPressed,

  processingRemainingReactions:processingRemainingReactions,
	afterProcessChoice:afterProcessChoice,
	expandDynReactions:expandDynReactions,

	// vue2?:
	PCState: {},
	choices: [],
	world: []

}

function dependsOn (libPrimitives, libReactions, gameReactions, reactionList, metaDealer, metaState) {
	this.libReactions = libReactions
	this.gameReactions = gameReactions
	this.reactionList = reactionList
	this.metaDealer = metaDealer
	this.metaState = metaState

	libPrimitives.dependsOn(this.world, this.reactionList, this.PCState, this.metaDealer, this.metaState);

	this.libReactions.dependsOn(libPrimitives, this.reactionList);

	this.gameReactions.dependsOn(libPrimitives, this.libReactions, this.reactionList );

  this.history = []
	this.lastAction = undefined
	this.reactionListCounter = 0
	this.enableChoices = true
	this.pendingPressKey = false
	this.pressKeyMessage = ""
	this.processedReactionList = []

}

function createWorld (libWorld, gameWorld) {

	this.gameTurn = 0;
	this.gameIsOver = false

	this.world = {
		attributes: [],
		items: [],
		directions: [],
		actions: []
	}

	this.devMessages = {}

	// merging libWorld and gameWorld into world and generating indexes (ref: ludi_runner.compileIndexes)

	// import game items (no items in lib)
	for (var i=0;i<gameWorld.items.length;i++) {
		this.world.items.push (gameWorld.items[i])
	}

	// adding items[].state.itemsMemory
	// if initial states are not defined, default values:
	for (var i=0;i<this.world.items.length;i++) {

		if ((this.world.items[i].type == "pc")) {

			// if state is not defined, it is created now
			if (typeof this.world.items[i].state == "undefined") this.world.items[i].state = {};

			// A item i is known if itemsMemory[i] exists.
			// the last container where item i was seen: itemsMemory[i].whereWas
			// the time it was seen: itemsMemory[i].lastTime

			// if itemsMemory is not defined, it is created now
			if (this.world.items[i].state.itemsMemory == null)
				this.world.items[i].state.itemsMemory = [];
		}

	}

	// import lib directions
	for (var i=0;i<libWorld.directions.length;i++) {
		this.world.directions.push (libWorld.directions[i])
	}

	// import game directions (only add more directions)
	for (var i=0;i<gameWorld.directions.length;i++) {
		this.world.directions.push (gameWorld.directions[i])
	}

	// import lib actions
	for (var i=0;i<libWorld.actions.length;i++) {
		this.world.actions.push (libWorld.actions[i])
	}

	// import game actions: (only add more actions)
	for (var i=0;i<gameWorld.actions.length;i++) {
		this.world.actions.push (gameWorld.actions[i])
	}

	// adding attExceptions (no items in lib)
	this.world.attExceptions = []
	for (var i=0;i<gameWorld.attExceptions.length;i++) {
		this.world.attExceptions.push (gameWorld.attExceptions[i])
	}

	// import lib attributes
	for (var i=0;i<libWorld.attributes.length;i++) {
		this.world.attributes.push (libWorld.attributes[i])
	}

	// import game attributes (by now: only add more attributes: what about overwriting?)
	for (var i=0;i<gameWorld.attributes.length;i++) {
		this.world.attributes.push (gameWorld.attributes[i])
	}

	// assign attributes to items
	for (var i=0;i<this.world.items.length;i++) {
		setDefaultAttributeProperties (this, i)
	}

	// indexes ---------

	this.PCState = {
		profile: {
			indexPC:0, // by default
			loc:  arrayObjectIndexOf (this.world.items, "id", this.world.items[0].loc),
			locId: this.world.items[0].loc
		}
	}

}

function arrayObjectIndexOf(myArray, property, searchTerm) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

function getCurrentChoice () {
	return this.choice
}

function getGameTurn () {
	return this.gameTurn
}


function getEnableChoices () {
	return this.enableChoices
}


// to-do: pending to check
function itemWithAttException (context, indexItem, attId_def) {

	var indexException = arrayObjectIndexOf(context.world.attExceptions, "id", attId_def);
	if (indexException >= 0) { // exists exception for this attribute?
		// look item in exceptionLinst
		for (var i=0; i< context.world.attExceptions[indexException].exceptionList.length; i++) {
			if (context.world.attExceptions[indexException].exceptionList[i] == context.world.items[indexItem].id)  return true;
		}
	}
	return false;
}

// assign attributes to items (from: this.world.items[indexItem].att[attIndex])
function setDefaultAttributeProperties (context, indexItem) {

	var attId_def; // attribute definition
	for (var indexAtt = 0; indexAtt < context.world.attributes.length; indexAtt++) {
		// elements like {id: "isDark", restrictedTo: Array[1], properties: Array[1], asignedTo: Array[1], enabledActions: Array[6]}
		attId_def = context.world.attributes[indexAtt].id;
		var isException = itemWithAttException(context, indexItem, attId_def);

		if (typeof context.world.items[indexItem].att == 'undefined')
			context.world.items[indexItem].att ={}; // item without any attribute

		var attOnItem = false;
		// each attribute in item definition
		for (var attId_item in context.world.items[indexItem].att) {
			if (attId_item == attId_def) {
				attOnItem = true;
				break;
			}
		}

		var attToBeImported = false;

		if (attOnItem) {

			if (isException) { // remove it
				delete context.world.items[indexItem].att[attId_def];
			}

			attToBeImported = true;
		} else {
			if ((context.world.attributes[indexAtt].asignedTo != 'undefined')  // att mandatory to item (global rule)
				 && !isException ) {  // not an exception
				for (var aTo in context.world.attributes[indexAtt].asignedTo) {
					if (context.world.items[indexItem].type == context.world.attributes[indexAtt].asignedTo[aTo]) {
						// item must have this attribute
						attToBeImported = true;
						break;
					}
				}
			}
		}

		// generalState: dirty tricky
		if (!attToBeImported) {
			if (attId_def == "generalState") {
				attToBeImported = true
			}
		}

		if (attToBeImported) {
			// get properties from attribute definition (at least: some of them)
			var propAlready;
			for (var pDef in context.world.attributes[indexAtt].properties) {
				propAlready = false;
				var proId = context.world.attributes[indexAtt].properties[pDef].id;
				for (var pItem in context.world.items[indexItem].att[attId_def]) {
					// if match; do not import
					if (typeof context.world.items[indexItem].att[attId_def][pItem][proId] != 'undefined') {
						propAlready = true;
						break;
					}
				}
				if (!propAlready) { // new property from definition
					if (typeof context.world.items[indexItem].att[attId_def] == 'undefined')
						context.world.items[indexItem].att[attId_def] = [];
					var isOptional = true;  // by default property is optional
					if (typeof context.world.attributes[indexAtt].properties[pDef].use != 'undefined') {
						if (context.world.attributes[indexAtt].properties[pDef].use == 'mandatory') {
							isOptional = false;
						}
					}
					// only add mandatory properties
					if (!isOptional) {
						context.world.items[indexItem].att[attId_def].push (context.world.attributes[indexAtt].properties[pDef]);
					}
				}
			}
		}

	}

}

function reactionListContains_Type (reactionList, type) {

	for (let r in reactionList) {
		if (reactionList[r].type == type) return true
	}

	return false

}

function processCode (state, level, functionId, par) {

  let status
	if (level == "userCode") {
		if (typeof state.gameReactions.executeCode == "function") {
			status = state.gameReactions.executeCode (functionId, par)
		}
	}
	if (level == "libCode") {
		if (typeof state.libReactions.executeCode == "function") {
			status =  state.libReactions.executeCode (functionId, par)
		}
	}
	return status

}

function setValueToItem (state, ir) {

	let variableElement = ir.activatedBy.split (".")
	let	item = state.libReactions.primitives.IT_X(variableElement[0])

	if (variableElement.length == 1) { // item.generalState.state
		state.libReactions.primitives.IT_SetAttPropValue(item, "generalState", "state", "1")
	} else if (variableElement.length == 2) { // item.X.state
			state.libReactions.primitives.IT_SetAttPropValue(item, variableElement[1], "state", "1")
	} else if (variableElement.length == 3) { // item.X.Y
			state.libReactions.primitives.IT_SetAttPropValue(item, variableElement[1], variableElement[2], "1")
	} else {
		console.log ("Erro: bad attribute sppecification")
	}

}


function execLink (param) {

	  for (var i=0; i<param.l1.subReactions.length;i++) {
	    //internal reaction
	    var ir = param.l1.subReactions[i]
	    if (ir == null) {
	      continue
	    }

	    if (ir.type == "visible") {
	      // params: ir.rid, ir.visible
	      for (var j=0; j<this.history[this.gameTurn-1].reactionList.length;j++) {
	        if (typeof this.history[this.gameTurn-1].reactionList[j].id != "undefined" ) {
	          if (this.history[this.gameTurn-1].reactionList[j].id == ir.rid ) {
	            this.history[this.gameTurn-1].reactionList[j].visible = ir.visible
	          }
	        }
	      }

	    } else if (ir.type == "activatedBy") {

	      console.log("internal reaction/activatedBy: " + JSON.stringify(ir) )
				setValueToItem(this, ir)

	    } else if (ir.type == "action") {
	      //console.log("internal reaction/action: " + JSON.stringify(ir) )

	      let choice = {choiceId: ir.choiceId}
	      if (choice.choiceId == 'obj1') {
	        choice.item1 = ir.o1
	        choice.itemId1 = ir.o1Id
	        choice.parent = ir. parent
	        this.processChoice (choice)
	      } else if (choice.choiceId == 'dir1') {
	        choice.isLeafe = true
	        choice.parent = "directActions"
	        // to-do?: d1Id -> d1
	        choice.action = {
	          actionId:"go",
	          d1: ir.d1,
	          d1Id: ir.d1Id,
	          target:ir.target,
	          targetId: ir.targetId,
	          isKnown:false
	        }
	        this.processChoice (choice)
	      } else if (choice.choiceId == 'action0') {
	        choice.isLeafe = true
	        choice.parent = "directActions"
	        choice.action = {
	          actionId: ir.actionId,
	          parent:"top"
	        }
	        this.processChoice (choice)
	      }  else if (choice.choiceId == 'action') {
	        choice.isLeafe = true
	        choice.parent = "obj1"
	        choice.action = {
	          item1: ir.o1,
	          item1Id: ir.o1Id,
	          actionId :ir.actionId
	        }
	        this.processChoice (choice)
	      } else if (choice.choiceId == 'action2') {
	        choice.isLeafe = true
	        choice.parent = "action2"
	        choice.action = {
	          item1: ir.o1,
	          item1Id: ir.o1Id,
	          actionId: ir.actionId,
	          item2: ir.o2,
	          item2Id: ir.o2Id
	        }
	        this.processChoice (choice)
	      }

	    }  else if ((ir.type == "userCode") || (ir.type == "libCode")) {
	      console.log(ir.type + ": " + JSON.stringify(ir) )
	      // params: .functionId, .par
	      let status = processCode (this, ir.type, ir.functionId, ir.par )
				/*
				 // not used by now
	      if (typeof status == 'object') {
	        if (status.enableChoices == true) {
	          this.setEnableChoices(true)
	        }

	      }
				*/

	    }
	  }


	  // link already chosen
	  for (let index=0;index<this.history[this.gameTurn-1].reactionList.length;index++) {
	    let r = this.history[this.gameTurn-1].reactionList[index]
	    if ((r.type == "rt_link") && (r.param.l1.id == param.l1.id)) {
	      r.active = false
	    }
	  }

}

function processChoice (newChoice, optionMsg) {

  if (offlineMode) {
		console.log("Debug choice: " + JSON.stringify(newChoice))
	}

  if (this.choice == undefined) {
		this.choice = {choiceId:'top', isLeafe:false, parent:''}
	}

	// empty this.reactionList
	this.reactionList.splice(0,this.reactionList.length)

	if (choice.choiceId == 'quit') return

	if (this.gameIsOver) return

	// console.log("<KL>choice input: " + JSON.stringify (choice))

	// parent
	var previousChoice = choice

	choice = newChoice

	if (choice.choiceId == 'top') choice.action = undefined

	if (choice.choiceId == 'obj1') choice.parent = previousChoice

	if (choice.isLeafe) { // execution

		// saving its previous location
		var locBefore
		if ( ( (choice.choiceId == 'action0') || (choice.choiceId == 'action') || (choice.choiceId == 'action2')) &&
		     (choice.action.item1 != undefined) ) {
			locBefore = this.world.items[choice.action.item1].loc
		}

		// vue2: var indexPCBefore = this.PCState.profile.indexPC
		var indexPCBefore = this.PCState.profile.indexPC

		// reseting variables
		this.lastAction = choice
		this.reactionListCounter = 0
		this.pendingPressKey = false
		this.pressKeyMessage = ""

		var flagPendingChoice = (choice.action.option != undefined)
		this.menu = []

		this.processedReactionList.splice(0, this.processedReactionList.length) // empty

		// game action execution
		this.processAction (choice.action, optionMsg)

		// to-do?: introduction message
	  // this.reactionList.unshift ({ type: 'rt_press_key', txt: 'press_key_to_start' })
		// this.reactionList.unshift ({ type: 'rt_msg', txt: 'Introduction' })

		// check whether is at least one refresh action in the reaction list
		var pendingRefresh = false
		for (var i=0;i<this.reactionList.length;i++) {
			if (this.reactionList[i].type == "rt_refresh") {
				pendingRefresh = true
				break
			}
		}

		// after execution, show the parent
		if ( !pendingRefresh &&

				// only after game actions
				( ((choice.choiceId == 'action0') ||(choice.choiceId == 'action') || (choice.choiceId == 'action2')) &&
				  (choice.action.item1 != undefined)) &&

				(locBefore == this.world.items[choice.action.item1].loc) && // item is still accesible
				(indexPCBefore == this.PCState.profile.indexPC) ) // same pc
		{
			choice = previousChoice
		} else {
			// top level of game choices
			choice = {choiceId:'top', isLeafe:false, parent:''};
		}

		choice.loc = this.world.items[this.PCState.profile.indexPC].loc

		// game over
		if (reactionListContains_Type (this.reactionList, "rt_end_game")) {
			this.gameIsOver = true
		}

		var menuDepth = 0
		if (reactionListContains_Type (this.reactionList, "rt_show_menu")) menuDepth++
		else {
			// to-do: in the future, if we allow actions after show_menu: if (state.menuDepth > 0) state.menuDepth--
			menuDepth = 0
		}

		// world turn
		if (!flagPendingChoice && // if flagPendingChoice do nothing
 			(!this.gameIsOver) &&
			(menuDepth == 0)) {
			//? this.gameTurn++

			for (var i=0;i<this.world.items.length;i++) {

				// attention! currently items[i].turn() are not called

				if (typeof this.gameReactions.turn == 'function') {
					// game level
					status = this.gameReactions.turn (i)
					if (status == true) continue;
					// by now: no lib turn
				}
			}
		}
	}

	// to see again all the actions for the item
	if (choice.choiceId == 'action') choice = previousChoice

	this.updateChoices()

}

function processAction (action, optionMsg) {

	var status

	action.pc = this.PCState.profile.indexPC

	// expanding codes
	if (action.item1 >= 0) action.item1Id = this.world.items [action.item1].id
	if (action.item2 >= 0) action.item2Id = this.world.items [action.item2].id

	action.loc = arrayObjectIndexOf (this.world.items, "id", this.world.items[this.PCState.profile.indexPC].loc)

	action.direction = action.d1
	if (action.direction != undefined) {
		action.directionId = this.world.directions [action.d1].id
		// it must be resolved here
		action.link = this.getTargetAndLocked (action.loc, action.direction)
	}

	status = false
	status = this.gameReactions.processAction (action)

	if (!status)
		status = this.libReactions.processAction (action)

	if (!status)
		this.reactionList.push ({type:"rt_msg", txt: 'You cannot:' + JSON.stringify (action)} )

	// update memory
	if (action.item1 >= 0) {
		var pos = arrayObjectIndexOf(this.world.items[this.PCState.profile.indexPC].state.itemsMemory, "itemIndex", action.item1)

		if (pos < 0) {
			this.world.items[this.PCState.profile.indexPC].state.itemsMemory.push ( {itemIndex:action.item1} )
			pos = arrayObjectIndexOf(this.world.items[this.PCState.profile.indexPC].state.itemsMemory, "itemIndex", action.item1)
		}
		this.world.items[this.PCState.profile.indexPC].state.itemsMemory[pos].whereWas = this.world.items[action.item1].loc
	}

	if (action.item2 >= 0) {
		var pos = arrayObjectIndexOf(this.world.items[this.PCState.profile.indexPC].state.itemsMemory, "itemIndex", action.item2)

		if (pos < 0) {
			this.world.items[this.PCState.profile.indexPC].state.itemsMemory.push ( {itemIndex:action.item2} )
			pos = arrayObjectIndexOf(this.world.items[this.PCState.profile.indexPC].state.itemsMemory, "itemIndex", action.item2)
		}
		this.world.items[this.PCState.profile.indexPC].state.itemsMemory[pos].whereWas = this.world.items[action.item2].loc

	}

	this.afterProcessChoice (action, optionMsg)

}

function afterProcessChoice (choice, optionMsg) {

	// dynamic messages
	let expandedReactionList = this.expandDynReactions(this.reactionList)

	// copy expandedReactionList into state.reactionList
	this.reactionList.splice(0,this.reactionList.length)

	for (var i=0;i<expandedReactionList.length;i++) {
	  this.reactionList.push (expandedReactionList[i])
	}

	// show the chosen option (echo)
	if (optionMsg != undefined) {
    // in reverse order (before the current reaction List)
		this.reactionList.unshift ({type:"rt_asis", txt: "<br/><br/>"} )
		this.reactionList.unshift ({type:"rt_kernel_msg", txt: "Chosen option m1", param: {m1: optionMsg} } )
	}

  this.processingRemainingReactions ()

}

function expandDynReactions (reactionList) {

	function arrayObjectIndexOf(myArray, property, searchTerm) {
		for(var i = 0, len = myArray.length; i < len; i++) {
			if (myArray[i][property] === searchTerm) return i;
		}
		return -1;
		}


	// expand each dyn reaction into static ones

	let sourceReactionList = reactionList.slice()
	//console.log("----------------------------------original reactionList:\n" + JSON.stringify (sourceReactionList))

	let expandedReactionList = []

	let currentPointer
	for (currentPointer = 0;
		 currentPointer < sourceReactionList.length;
		 currentPointer++) {

		if (sourceReactionList[currentPointer].type == "rt_desc") {

			// alreaded resolved
			if (sourceReactionList[currentPointer].resolved) {
				expandedReactionList.push (JSON.parse(JSON.stringify(sourceReactionList[currentPointer])) )
				continue
			}

			// static resolution
			let reaction = this.gameReactions.getItem (sourceReactionList[currentPointer].o1Id)

			if (reaction == undefined) {
				sourceReactionList[currentPointer].resolved = true
				expandedReactionList.push (JSON.parse(JSON.stringify(sourceReactionList[currentPointer])) )
				continue
			}

			// dynamic resolution: getting a new this.reactionList
			var attribute = "desc"
			if (typeof reaction[attribute] != 'function') {
				console.log ("dyn desc not resolved: " + JSON.stringify(sourceReactionList[currentPointer]))
				sourceReactionList[currentPointer].resolved = true
				expandedReactionList.push (JSON.parse(JSON.stringify(sourceReactionList[currentPointer])) )
				continue
			}

			// empty previous this.reactionList
			this.reactionList.splice(0,this.reactionList.length)
			reaction[attribute]()

			// catch up reactions of this.reactionlist and insert them in expandedReactionList
			for (let newReaction in this.reactionList) {
				if (this.reactionList[newReaction].type == "rt_desc") {
					this.reactionList[newReaction].resolved = false
				}
				expandedReactionList.push (JSON.parse(JSON.stringify(this.reactionList[newReaction])))
			}
			// empty this.reactionList
			this.reactionList.splice(0,this.reactionList.length)
		} else if (sourceReactionList[currentPointer].type == "rt_dev_msg") {

			let lang =  sourceReactionList[currentPointer].lang
			// store internal translations
			if (typeof this.devMessages[lang] == "undefined") { 	this.devMessages[lang] = {}	}
			let longMsgId = "messages." + sourceReactionList[currentPointer].txt + ".txt"

			if (typeof this.devMessages[lang][longMsgId] == "undefined") {
				this.devMessages[lang][longMsgId] = sourceReactionList[currentPointer].detail
			}

		} else {
			// standard static reaction
			expandedReactionList.push (JSON.parse(JSON.stringify(sourceReactionList[currentPointer])) )
		}
	}

	// check whether there are remaining rt_desc reactions
	var rt_descRemain = false
	for (currentPointer = 0;
		 currentPointer < expandedReactionList.length;
		 currentPointer++) {
		 if ((expandedReactionList[currentPointer].type == "rt_desc") ||
		 		 (expandedReactionList[currentPointer].type == "rt_dev_msg") ) {
			 	if (!expandedReactionList[currentPointer].resolved) {
			 		rt_descRemain = true
			 		break
			  }
		 }
	}

	// recursivity: don't panic!
	if (rt_descRemain) {
			let expandedReactionList2 = expandedReactionList.slice()
			expandedReactionList = this.expandDynReactions (expandedReactionList2)
	}

  // set selfIndex
	/*
	for (let selfIndex = 0; selfIndex < expandedReactionList.length; selfIndex++) {
		expandedReactionList[selfIndex].selfIndex = selfIndex
	}
	*/


	return expandedReactionList.slice()
}

function setEnableChoices (value) {
	this.enableChoices = value

}


function keyPressed () {

  //alert ("keyPressed! (" + this.reactionListCounter + "): " +  JSON.stringify(this.reactionList[this.reactionListCounter]))
  this.pendingPressKey = false

  if (this.reactionListCounter >= this.reactionList.length) {
		  // here!?
		this.reactionListCounter = 0
		return
	}

	if (this.reactionList[this.reactionListCounter].type == "rt_press_key")  {
		 if (!this.reactionList[this.reactionListCounter].alreadyPressed) {
		   // marked as pressed
			 this.reactionList[this.reactionListCounter].alreadyPressed = true
			 this.processedReactionList.push (this.reactionList[this.reactionListCounter])
			 this.reactionListCounter ++
		 }
  }

	this.processingRemainingReactions ()

}

function processingRemainingReactions () {

	for (;this.reactionListCounter<this.reactionList.length; this.reactionListCounter++) {
		if (this.reactionList[this.reactionListCounter].type == "rt_enable_choices")  {
			// set flag and go on
			this.enableChoices = this.reactionList[this.reactionListCounter].value
		} else if (this.reactionList[this.reactionListCounter].type == "rt_press_key")  {
			 if (!this.reactionList[this.reactionListCounter].alreadyPressed) {
				 this.pendingPressKey = true
				 this.pressKeyMessage = this.reactionList[this.reactionListCounter].txt
				 return
			 }
		} else if (this.reactionList[this.reactionListCounter].type == 'rt_show_menu') {
 			 this.menu = this.reactionList[this.reactionListCounter].menu
 			 this.menuPiece = this.reactionList[this.reactionListCounter].menuPiece
			 this.pendingChoice = this.lastAction
			 // actions after a rt_show_menu will be ommited
		} else {
			 if (this.reactionList[this.reactionListCounter].type == "rt_end_game") {
		 	 	  this.gameIsOver = true
		   }

			 /*
			 if (this.reactionList[this.reactionListCounter].type == "rt_link") {
				 console.log ("Pre of rt_link: " + JSON.stringify(this.reactionList[this.reactionListCounter]))
		   }
			 */

			 this.processedReactionList.push (this.reactionList[this.reactionListCounter])
		}
	}

	// add reaction entry to history
	this.history.push ({
		gameTurn: this.gameTurn,
		action: this.lastAction,
		reactionList: this.processedReactionList.slice()
	})

	this.processedReactionList = []
	this.lastAction = undefined

	this.gameTurn++

	// reactionList end of life
  this.reactionList.splice(0,this.reactionList.length)

}

function actionIsEnabled (actionId, item1, item2) {

	var status = undefined

	if (typeof this.gameReactions.actionIsEnabled == "function")
		status = this.gameReactions.actionIsEnabled (actionId, item1, item2)

	if (status == undefined)
		status = this.libReactions.actionIsEnabled (actionId, item1, item2)

	return status
}

function getTargetAndLocked (loc, direction) {

	var connection = {target: -1, isLocked: false};


	if (this.world.items[loc].address == undefined) return connection

	// target and locked resolution
	var targetId;
	var dirId = this.world.directions[direction].id;
	var internalDirIndex =  0; // look for dirIndex (direction) in this.world.items[loc].address[] {dir, target, locked}
	for (var i=0;i<this.world.items[loc].address.length;i++) {
		if (this.world.items[loc].address[i].dir == dirId) {
			// get target
			if (typeof this.world.items[loc].address[i].target != 'undefined') {
				targetId = this.world.items[loc].address[i].target;
				connection.target = arrayObjectIndexOf(this.world.items, "id", targetId);
			} else { // check dynamic target

				let reaction = this.gameReactions.getItem (this.world.items[loc].id)

				if (reaction) {
					if (typeof reaction.target == 'function'){
						targetId = reaction.target (dirId);
						if (targetId == "locked")
							connection.isLocked = true;
						else
							connection.target = arrayObjectIndexOf(this.world.items, "id", targetId);
					}
				}
			}

			// get isLocked
			if (!connection.isLocked) { // if not statically locked
				if (typeof this.world.items[loc].address[i].locked != 'undefined') {
					connection.isLocked = (this.world.items[loc].address[i].locked == "true");
				}
			}
			break;
		}
	}

	connection.isKnown = false
	if (connection.target != -1) {
		var pos = arrayObjectIndexOf(this.world.items[this.PCState.profile.indexPC].state.itemsMemory, "itemIndex", connection.target)
		connection.isKnown = (pos >=0)
	}

	return connection;

}


function updateChoices(showAll) {

  showAll = typeof showAll !== 'undefined' ?  showAll : true;

  if (!showAll && (choice.choiceId == 'top')) showAll = true

	if (choice.choiceId == 'quit') return

	// updating this.PCState.profile.loc
	var newLoc = arrayObjectIndexOf (this.world.items, "id", this.world.items[this.PCState.profile.indexPC].loc)
	if (this.world.items[this.PCState.profile.loc].id != this.world.items[this.PCState.profile.indexPC].loc) {
		this.PCState.profile.loc = newLoc
		this.PCState.profile.locId = this.world.items[this.PCState.profile.indexPC].loc
	}

	// update current loc
	var pos = arrayObjectIndexOf(this.world.items[this.PCState.profile.indexPC].state.itemsMemory, "itemIndex", newLoc)
	if (pos < 0) { // new entry
		 if (debugMode) {
			 	console.log ("<KL>Loc ["+ this.world.items[this.PCState.profile.indexPC].loc + "] is now known.")
		 }
		 this.world.items[this.PCState.profile.indexPC].state.itemsMemory.push ({itemIndex: newLoc})
	} else { // update it
		if (debugMode) {
 		  console.log ("<KL>Loc ["+ this.world.items[this.PCState.profile.indexPC].loc + "] is now updated.")
		}
		this.world.items[this.PCState.profile.indexPC].state.itemsMemory[pos] = {itemIndex: newLoc, whereWas:-1, lastTime:-1 }
	}

	this.choices = []

	this.choices.push ({choiceId:'top', isLeafe:false, parent:""});

	this.internalChoices = {
		directActions: [],
		directionGroup: [],
		itemGroup_here: [],
		itemGroup_carrying: [],
		itemGroup_notHere: []
	}

	// direct actions
	for (var i=0; i< this.world.actions.length; i++) {
		if (this.world.actions[i].numpar == 0) {
			var actionId = this.world.actions[i].id
			if (this.actionIsEnabled  (actionId)) {
				this.internalChoices.directActions.push ({choiceId:'action0', isLeafe:true, parent:"directActions", action: { actionId: actionId, parent:"top"}})
			}
		}
	}

	// directions
	for (var d=0;d<this.world.directions.length;d++) {

		var link = this.getTargetAndLocked (this.PCState.profile.loc, d)
		if (link.target >= 0) {
				if (debugMode) {
					// bug: actionIsEnabled not used
					console.log ("warning: actionIsEnabled on directions")
				}
				//if (this.actionIsEnabled  (actionId, d, link.target)) {
					this.internalChoices.directionGroup.push ({choiceId:'dir1', isLeafe:true, parent:"directionGroup", parent:"directActions", action: {actionId:'go', d1: d, d1Id: this.world.directions[d].id, target:link.target, targetId: this.world.items[link.target].id, isKnown:link.isKnown}})
				//}
		}
	}

	// items here
	for (var i=0;i<this.world.items.length;i++) {
		if (i == this.PCState.profile.indexPC) continue;
		if (this.world.items[i].type == "loc") continue;

		if (this.world.items[i].loc == this.world.items[this.PCState.profile.indexPC].loc) {
			this.internalChoices.itemGroup_here.push ({choiceId:'obj1', item1: i, item1Id: this.world.items[i].id, parent:"here"});
		}
	}

	// items carried
	for (var i=0;i<this.world.items.length;i++) {
		if (i == this.PCState.profile.indexPC) continue;
		if (this.world.items[i].type == "loc") continue;

		if (this.world.items[i].loc == this.world.items[this.PCState.profile.indexPC].id) {
			this.internalChoices.itemGroup_carrying.push ({choiceId:'obj1', item1: i, item1Id: this.world.items[i].id, parent:"carrying"});
		}
	}

	// absent items
	for (var i=0;i<this.world.items.length;i++) {
		if (i == this.PCState.profile.indexPC) continue;
		if (this.world.items[i].type == "loc") continue;
		if (this.world.items[i].loc == this.world.items[this.PCState.profile.indexPC].loc) continue;
		if (this.world.items[i].loc == this.world.items[this.PCState.profile.indexPC].id) continue;

		let reaction = this.gameReactions.getItem (this.world.items[i].id)

		if (reaction) {
			if (typeof reaction.shownWhenAbsent == 'function'){
				if (!reaction.shownWhenAbsent ()) continue

				this.internalChoices.itemGroup_notHere.push ({choiceId:'obj1', item1: i, item1Id: this.world.items[i].id, parent:"notHere"});
			}
		}
	}

	// counting choices
	if (this.internalChoices.directActions.length > 0){
		this.choices.push ({choiceId:'directActions', isLeafe:false, parent:"top", count: this.internalChoices.directActions.length});

		if ((showAll) || (choice.choiceId == 'directActions')) {

			// if only 'look':
      // this.choices.push ({choiceId:'action0', isLeafe:true, parent:"directActions", action:{actionId:'look', parent:"top"}});

			// all direct actions are not shown all the time (top)
			for (var i in this.internalChoices.directActions)
					this.choices.push (this.internalChoices.directActions[i])
		}
	}

	if (this.internalChoices.directionGroup.length > 0){
		this.choices.push ({choiceId:'directionGroup', isLeafe:false, parent:"top", count: this.internalChoices.directionGroup.length});

		if ((showAll) ||(choice.choiceId == 'directionGroup')) {
			for (var i in this.internalChoices.directionGroup)
				this.choices.push (this.internalChoices.directionGroup[i])
		}
	}

	if (this.internalChoices.itemGroup_here.length > 0){
		this.choices.push ({choiceId:'itemGroup', isLeafe:false, itemGroup: 'here', parent:"top", count: this.internalChoices.itemGroup_here.length});

		if ((showAll) || ((choice.choiceId == 'itemGroup') && (choice.itemGroup == 'here'))) {
			for (var i in this.internalChoices.itemGroup_here)
				this.choices.push (this.internalChoices.itemGroup_here[i])
		}
	}

	if (this.internalChoices.itemGroup_carrying.length > 0){
		this.choices.push ({choiceId:'itemGroup', isLeafe:false, itemGroup: 'carrying', parent:"top", count: this.internalChoices.itemGroup_carrying.length});

		if ((showAll) || ((choice.choiceId == 'itemGroup') && (choice.itemGroup == 'carrying'))) {
			for (var i in this.internalChoices.itemGroup_carrying)
				this.choices.push (this.internalChoices.itemGroup_carrying[i])
		}
	}

	if (this.internalChoices.itemGroup_notHere.length > 0){

		this.choices.push ({choiceId:'itemGroup', isLeafe:false, itemGroup: 'notHere', parent:"top", count: this.internalChoices.itemGroup_notHere.length});
		// absent items are not shown all the time (top)
		if ((choice.choiceId == 'itemGroup') && (choice.itemGroup == 'notHere')) {
			for (var i in this.internalChoices.itemGroup_notHere)
				this.choices.push (this.internalChoices.itemGroup_notHere[i])
		}
	}

	if (choice.choiceId == 'obj1') {

		// if the item has items inside (container), show them
		for (var itemInside=0; itemInside< this.world.items.length; itemInside++) {
			if (itemInside == choice.item1) continue; // item1 into itself
			if (this.world.items[itemInside].type == 'loc') continue // location into item1

			var itemInsideLoc = arrayObjectIndexOf (this.world.items, "id",this.world.items[itemInside].loc)

			if (itemInsideLoc != choice.item1)  continue // itemInsideLoc must be the container (item1)

			// finally the container must be carried or here
			if ( (this.world.items[itemInsideLoc].loc != this.world.items[this.PCState.profile.indexPC].id) &&  // not carried
				 (this.world.items[itemInsideLoc].loc != this.world.items[this.PCState.profile.indexPC].loc) )  // not here
				continue

			this.choices.push ({choiceId:'obj1', item1: itemInside, item1Id: this.world.items[itemInside].id, parent:"inside", parentItem: choice.item1});
		}

		// actions on the item
		for (var i=0; i< this.world.actions.length; i++) {
			var actionId = this.world.actions[i].id
			if (this.world.actions[i].numpar == 0) continue;

			if (this.actionIsEnabled  (actionId, choice.item1)) { 		// obj1 + action
				this.choices.push ({choiceId:'action', isLeafe:true, parent:"obj1", action: { item1: choice.item1, item1Id: this.world.items[choice.item1].id, actionId: actionId }})
			} else {
				var j=0
				for (; j< this.world.items.length; j++) {
					if (j == choice.item1) continue; // item1 on item1
					if (j == this.PCState.profile.indexPC) continue; // self action with item1

					// j must be carried or here
					if ( (this.world.items[j].loc != this.world.items[this.PCState.profile.indexPC].id) &&  // not carried
						 (this.world.items[j].loc != this.world.items[this.PCState.profile.indexPC].loc) )  // not here
					continue;

					if (this.actionIsEnabled  (actionId, choice.item1, j)) { // obj1 + action + obj2
						this.choices.push ({choiceId:'action2', isLeafe:true, parent:"action2", action: { item1: choice.item1, item1Id: this.world.items[choice.item1].id, actionId: actionId, item2:j, item2Id: this.world.items[j].id }})
					}
				}
			}
		}

		/*
		if (choice.parent == 'notHere') {
			// specially for absent items
			if ( "itemsMemory for choice.item1 exists") {
				this.choices.push ({choiceId:'action', isLeafe:true, parent:"obj1", action: { item1: choice.item1, actionId: "where" }})
			}
		}
		*/

	}

}
