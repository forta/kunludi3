"use strict";

//Section 1a: gameReaction (lib overwrite)
//Section 1b: gameReaction (game actions)
//Section 2: gameAttribute
//Section 3: gameItems
//Section 4: internal functions

// **********************************************
//Section 1: gameReaction
// **********************************************

/*

Funciones de usuario de alto nivel:

Las funciones de usuario usan estas variables:
Se usa un atributo genérico en cada item que lo necesite: primitives.IT_GetAttPropValue (item, "generalState", "state")
primitives.IT_GetAttPropValue (PC_X(), "generalState", "state") : estado del jugador activo:

*/

let reactionList = [];
let primitives, libReactions

let reactions = []
let attributes = []
let items = []

// uso interno
let usr = {}


/* Expose stuff */
// module.exports = exports = {
export default { // versión offline
	dependsOn:dependsOn,
	processAction:processAction,
	itemMethod:itemMethod,
	actionIsEnabled:actionIsEnabled,
	turn:turn,
	getItem:getItem,
	getReaction:getReaction
}

function getItem (itemId) {
	var itemIndex = arrayObjectIndexOf(this.items, "id", itemId);

	if (itemIndex>-1) {
		return this.items[itemIndex]
	}

}

function getReaction (itemId) {
	var reactionIndex = arrayObjectIndexOf(this.reaction, "id", itemId);

	if (reactionIndex>-1) {
		return this.reactions[reactionIndex]
	}

}

function dependsOn (primitives, libReactions, reactionList) {
	this.primitives = primitives
	this.libReactions = libReactions
	this.reactionList = reactionList

	this.reactions = []

	initReactions(this.reactions, this.primitives)

	this.attributes = []
	initAttributes(this.attributes, this.primitives)

	this.items = []
	initItems(this.items, this.primitives)

	// get item indexes
	for (var i=0; i<this.items.length;i++) {
		this.items[i].index = this.primitives.IT_X(this.items[i].id)
	}

	usr.primitives = this.primitives

}

function arrayObjectIndexOf(myArray, property, searchTerm) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

// external interface
function processAction (action) {

	let actionIndex = arrayObjectIndexOf (this.reactions, "id", action.actionId)
	if (actionIndex < 0 ) {
		// this.reactionList.push ({type:"rt_msg", txt: 'Error: missing actionId on gReactions: ' + action.actionId} )
		return undefined
	}

	// to-do: verify again  if action is enabled

	console.log ("game action: " +  JSON.stringify (action))

	if (typeof this.reactions[actionIndex].reaction == 'function') {
		return this.reactions[actionIndex].reaction (action)
	}
}

function itemMethod (itemId, methodName, params) {

	var localIndex = arrayObjectIndexOf(this.items, "id", itemId)

	return this.items[localIndex][methodName](params)

}


// external interface
function actionIsEnabled (actionId, item1, item2) {

	if (actionId == undefined) return undefined

	var reactionIndex = arrayObjectIndexOf(this.reactions, "id", actionId)

	if (this.reactions[reactionIndex] == undefined) return undefined
	if (this.reactions[reactionIndex].enabled == undefined) return undefined

	return this.reactions[reactionIndex].enabled(item1, item2)

}


// ============================

let initReactions =  function  (reactions, primitives) {

	reactions.push ({ 	// saltar, de lib, deshabilitado
		id: 'jump',
		enabled: function (indexItem, indexItem2) { 	return false 	}
	});
	reactions.push ({ 	// cantar, de lib, deshabilitado
		id: 'sing',
		enabled: function (indexItem, indexItem2) { return false 	}
	});
	reactions.push ({ 	// wait, de lib, deshabilitado
		id: 'wait',
		enabled: function (indexItem, indexItem2) { 	return false	}
	});

	// look, de lib, deshabilitado, pero se usa como lanzador inicial

	reactions.push ({
		id: 'look',

		reaction: function (par_c) {

				// generación del menú
				if (typeof par_c.option == 'undefined') { // phase 1: asking dialog, when you come in

				primitives.GD_CreateMsg ("es", "entras", "Oyes un ligero movimiento y tocas a la puerta. Te abren y entras.");

				primitives.GD_CreateMsg ("es", "opt_presentarte", "Te presentas");
				primitives.GD_CreateMsg ("es", "opt_preguntas", "¿Quién eres?");

				primitives.CA_ShowMsg ("entras");

				var menu = [{id:"opt_presentarte",msg:"opt_presentarte"}, {id:"opt_preguntas", msg:"opt_preguntas"}];
				primitives.CA_ShowMenu (menu); // continuation in state == 0, phase 2

				return true;

			} else { // reaction: ejecución de la acción seleccionada en el menú
				  /*
					// para que un menú sea reentrante:

				  par_c.option = undefined;
					var menu = [{id:"woman", msg:"chooseprimitives.PC_woman"},{id:"man", msg:"chooseprimitives.PC_man"}];
					primitives.CA_ShowMenu (menu); // continuation in state == 0, phase 2
					return true;
					*/

				if (par_c.option == "opt_presentarte") {

					primitives.GD_CreateMsg ("es", "te_presentas", "Te presentas y le cuentas tu historia");
					primitives.CA_ShowMsg ("te_presentas");

					par_c.option = undefined;
					// to-do: meter el recálculo externo de menús aquí:
					var menu = [{id:"opt_presentarte",msg:"opt_presentarte"}, {id:"opt_preguntas", msg:"opt_preguntas"}];
					primitives.CA_ShowMenu (menu); // reentrante

					return true;

				} else {

					primitives.GD_CreateMsg ("es", "se_presenta", "Soy Erika, no te acerques mucho.");
					primitives.CA_ShowMsg ("se_presenta");

					//primitives.CA_EndGame ("Se acabó la fiesta.");

					return true;

				}
			}


			return false;
		},

		enabled: function (indexItem, indexItem2) {
			return true
		}

	});


	reactions.push ({
		id: 'go',

		reaction: function (par_c) {

			return false; // se ejecuta reacción por defecto
		}
	});

}

// **********************************************
//Section 2: gameAttribute
// **********************************************

let initAttributes =  function  (attributes, primitives) {

}

// **********************************************
//Section 3: items
/*
available methods for each item:
	desc()
	[precondToGo(dir)] // for "loc" items: to unlock/unlock exits
	turn() // by now, mandatory for "npc" and "pc" items

*/

// **********************************************

let initItems =  function  (items, primitives) {

	items.push ({
		id: 'habitación',
		desc: function () {
			primitives.GD_CreateMsg ("es", "sb_desc_1", "En mitad de la fiesta, ves cómo la gente se pone cachonda y luego algo agresiva. Esquivas a un par de tipos moscosos, que luego se empiezan a pelear entre ellos y a morderse entre sí. La sangre salpica a varios de los presentes, que empiezan a pelearse y a morderse. La música se para, las luces se apagan y quedas en mitad de la oscuridad, entre gritos. Cómo lamentas haber tendido que dejar el móvil en el control de seguridad de \"la fiesta más salvaje del año\". Aunque la fiesta se realiza en un páramo aislado del resto del mundo, sin ni siquera cobertura de datos, ahora al menos podrías usar el móvil como linterna para moverte en este infierno.<br/><br/>Menos mal que no estabas dentro la pista de baile sino cerca de la barra, esperando que el camarero cachas al que echabas ojitos te hiciera caso. Aunque el alcohol y la confusión te han desubicado un poco, crees que a tu derecha está la salida de la zona de baile.");

			primitives.GD_CreateMsg ("es", "sb_desc_2", "De vuelta en la pista de baile. Los ruidos y gritos se han atenuado. Parece que los rabiosos se van matando entre sí y cada vez quedan menos dando guerra, pero siguen habiendo muchos.");

			if (!primitives.IT_GetIsItemKnown(primitives.PC_X(), this.index)) { // primera vez
				primitives.CA_ShowMsg ("sb_desc_1");
			} else { // siguientes veces
				primitives.CA_ShowMsg ("sb_desc_2");
			}
		}
	});

	items.push ({
		id: 'habitación2',
		desc: function () {
			primitives.GD_CreateMsg ("es", "sb_desc_1", "En mitad de la fiesta, ves cómo la gente se pone cachonda y luego algo agresiva. Esquivas a un par de tipos moscosos, que luego se empiezan a pelear entre ellos y a morderse entre sí. La sangre salpica a varios de los presentes, que empiezan a pelearse y a morderse. La música se para, las luces se apagan y quedas en mitad de la oscuridad, entre gritos. Cómo lamentas haber tendido que dejar el móvil en el control de seguridad de \"la fiesta más salvaje del año\". Aunque la fiesta se realiza en un páramo aislado del resto del mundo, sin ni siquera cobertura de datos, ahora al menos podrías usar el móvil como linterna para moverte en este infierno.<br/><br/>Menos mal que no estabas dentro la pista de baile sino cerca de la barra, esperando que el camarero cachas al que echabas ojitos te hiciera caso. Aunque el alcohol y la confusión te han desubicado un poco, crees que a tu derecha está la salida de la zona de baile.");

			primitives.GD_CreateMsg ("es", "sb_desc_2", "De vuelta en la pista de baile. Los ruidos y gritos se han atenuado. Parece que los rabiosos se van matando entre sí y cada vez quedan menos dando guerra, pero siguen habiendo muchos.");

			if (!primitives.IT_GetIsItemKnown(primitives.PC_X(), this.index)) { // primera vez
				primitives.CA_ShowMsg ("sb_desc_1");
			} else { // siguientes veces
				primitives.CA_ShowMsg ("sb_desc_2");
			}
		}
	});


}

// GENERIC turn **********************************************************************************************

function turn (indexItem) {

	var  primitives = this.primitives // tricky

	/*
	if (indexItem == primitives.IT_X("hall")) {
		usr.turnoHall()

		usr.debug()
	}
	*/

}
