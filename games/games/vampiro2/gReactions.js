// Second version using simplified lib v.002: october 2020

//Section 1a: gameReaction (lib overwrite)
//Section 1b: gameReaction (game actions)
//Section 2: gameAttribute
//Section 3: gameItems
//Section 4: game functions

// **********************************************
//Section 1: gameReaction
// **********************************************

let p, libReactions

let reactions = []
let attributes = []
let items = []


let usr = {}

/* Expose stuff */

//module.exports = exports = {
export default {

	dependsOn:dependsOn,
	processAction:processAction,
	itemMethod:itemMethod,
	actionIsEnabled:actionIsEnabled,
	turn:turn,getItem:getItem,
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

function dependsOn (p, libReactions, reactionList) {
	this.p = p
	this.libReactions = libReactions
	this.reactionList = reactionList


	this.reactions = []
	initReactions(this.reactions, this.p)

	this.attributes = []
	initAttributes(this.attributes, this.p)

	this.items = []
	initItems(this.items, this.p)

	usr.primitives = this.p

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

	return this.reactions[actionIndex].reaction (action)

}

function itemMethod (itemId, methodName, params) {

	var localIndex = arrayObjectIndexOf(this.items, "id", itemId)

	return this.items[localIndex][methodName](params)

}

function turn (indexItem) {
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

let initReactions =  function  (reactions, p) {

	reactions.push ({

		id: 'afilar', // único verbo específico del juego, no existe a nivel de librería

		enabled: function (indexItem, indexItem2) {
			//0.01 if (p.IT_GetId(indexItem) == "madera") return true;
			if (indexItem == p.idx("madera")) return true;
			return false;
		},


		reaction: function (par_c) {

			p.GD_CreateMsg ("es", "afilas_madera", "Afilas la madera con el cuchillo ¡y obtienes una estaca!<br/>");
			p.GD_CreateMsg ("es", "Xnecesitas_afilador", "Necesitas algo con qué afilarla<br/>");

			if ( par_c.item1Id == "madera") {
				//0.01 if (pr.IT_GetLoc (p.IT_X("cuchillo")) == pr.PC_X()) {  // tener cuchillo encima
				if (p.getProps(p.idx("cuchillo")).loc == p.pc().index) {  // tener cuchillo encima
					p.CA_ShowMsg ("afilas_madera");

					//0.01 p.IT_SetLoc(p.IT_X("estaca"), p.IT_GetLoc(p.IT_X("madera")));
					p.setProp(p.idx("estaca"), "loc", p.getProps(par_c.item1).loc);

					//0.01 p.IT_SetLocToLimbo(par_c.item1);
					p.toLimbo(par_c.item1);
				} else
					p.CA_ShowMsg ("Xnecesitas_afilador");
			}
			return true;
		}

	});

	reactions.push ({ //lo capamos
		id: 'jump',
		enabled: function (indexItem,indexItem2) { 	return false; }
	});

	reactions.push ({ //lo capamos
		id: 'sing',
		enabled: function (indexItem,indexItem2) { 	return false; }
	});

	reactions.push ({ //lo capamos
		id: 'wait',
		enabled: function (indexItem,indexItem2) { 	return false; }
	});

	reactions.push ({ //lo capamos
		id: 'close',
		enabled: function (indexItem,indexItem2) { 	return false; }
	});

	reactions.push ({
		id: 'look',

		reaction: function (par_c) {

			p.GD_CreateMsg ("es", "undefined_gameParameters", "Este juego necesita tener definido el atributo gameParameters en la localidad inicial del juego<br/>");
			p.GD_CreateMsg ("es", "bienvenida_juego_1", "El Proyecto Vampiro (http://wiki.caad.es/Proyecto_Vampiro)) consiste en recrear una aventura muy sencilla en un nuevo lenguaje. En este caso, el objetivo es demostrar las posibilidades de LUDI. Basado en la versión Twine de no2nsence, que a su vez se basa en las versiones de fi.js (por baltasarq) e Inform 7 (por Sarganar).<br/><br/>");
			p.GD_CreateMsg ("es", "bienvenida_juego_2", "Despiertas aturdido. Después de unos segundos te incorporas en el frío suelo de piedra y ves que estás en un castillo. ¡Ahora recuerdas! Eres reXXe y tu misión es la de matar al vampiro. TIENES que matar al vampiro que vive en la parte superior del castillo...<br/><br/>");

			//0.01 if (par_c.loc == p.IT_X("vestibulo")) {
			if (par_c.loc == p.idx("vestibulo")) {

				if (!p.IT_ATT(par_c.loc, "gameParameters")) {
					p.CA_ShowMsg ("undefined_gameParameters");
					p.CA_EndGame("Error");
					return true;
				}

				if (p.IT_GetAttPropValue (par_c.loc, "gameParameters", "version") == "") {
					p.CA_ShowImg ("portada_vampiro.jpg", true);

					p.CA_ShowMsg ("bienvenida_juego_1");
					p.CA_ShowMsg ("bienvenida_juego_2");

					p.IT_SetAttPropValue (par_c.loc, "gameParameters", "version","iniciado");

				}
			}

			// to-do: imágenes de las localidades (porque el kernel no lo pemite)
			//0.01 p.CA_ShowImg (p.IT_GetId (par_c.loc) + ".jpg", true);
			p.CA_ShowImg (p.getProps(par_c.loc).id + ".jpg", true);

			return false;
		}

	});

	/* eventos a considerar :

		abrir barril (con palanca) -> martillo
		afilar madera -> estaca
		abrir armario pequeño (con llave) -> ajos
		entrar final -> ganaste
		ex cama -> ex sábanas -> llavecita
		ex chimenea -> madera

	*/

	reactions.push ({
		id: 'open',

		reaction: function (par_c) {

			p.GD_CreateMsg ("es", "aparece_martillo", "-¡Clack! - Haciendo palanca logras abrir el barril.<br/>Dentro hay un martillo.<br/>");
			p.GD_CreateMsg ("es", "aparecen_ajos", "Abres el armario con la llavecita.<br/>Al examinarlo se te cae al suelo una ristra de ajos que estaba en su interior.<br/>");
			p.GD_CreateMsg ("es", "Xno_abres_o1", "No consigues abrir %o1.<br/>");
			p.GD_CreateMsg ("es", "Xo1_ya_abierto", "%o1 ya está abierto.<br/>");

			if (par_c.item1Id == "barril") {
				if (p.IT_GetLoc (p.IT_X("martillo")) == p.IT_X("limbo")) {
					if (p.IT_GetLoc (p.IT_X("palanca")) == p.PC_X()) {// tener palanca
						p.CA_ShowMsg ("aparece_martillo");
						p.IT_SetLoc(p.IT_X("martillo"), p.PC_GetCurrentLoc());
					} else
						p.CA_ShowMsg ("Xno_abres_o1", [par_c.item1Id]);
				} else { // ya está abierto
					p.CA_ShowMsg ("Xo1_ya_abierto" , [par_c.item1Id]);
				}

				return true;
			}

			if (par_c.item1Id == "armario_pequeño") {
				if (p.IT_GetLoc (p.IT_X("ajos")) == p.IT_X("limbo")) {
					if (p.IT_GetLoc (p.IT_X("llave")) == p.PC_X()) { // tener llave
						p.CA_ShowMsg ("aparecen_ajos");
						p.IT_SetLoc(p.IT_X("ajos"), p.PC_GetCurrentLoc());
					} else
						p.CA_ShowMsg ("Xno_abres_o1", [par_c.item1Id]);
				} else { // ya está abierto
					p.CA_ShowMsg ("Xo1_ya_abierto" , [par_c.item1Id]);
				}
				return true;
			}

			if (par_c.item1Id == "ataud") {
				if ( (p.IT_GetLoc (p.IT_X("ajos")) != p.PC_X()) ||
					 (p.IT_GetLoc (p.IT_X("estaca")) != p.PC_X()) ||
					 (p.IT_GetLoc (p.IT_X("martillo")) != p.PC_X()) ||
					 (p.IT_GetLoc (p.IT_X("cruz")) != p.PC_X()) ) {
					p.GD_CreateMsg ("es", "no_se_puede_abrir_ataúd", "Necesito cuatro cosas antes de poner fin a la 'vida' del vampiro. A saber: un crucifijo, una ristra de ajos, una estaca afilada y un martillo.<br/>");
					p.CA_ShowMsg ("no_se_puede_abrir_ataúd");
				} else {
					p.CA_ShowImg ("fin.png", true);
					p.CA_ShowMsg ("final");
					p.CA_EndGame ("ganaste");
				}
				return true;
			}

			return false;
		}

	});

	reactions.push ({
		id: 'ex',

		reaction: function (par_c) {

			if (par_c.item1Id == "chimenea") {
				p.GD_CreateMsg ("es", "desc_chimenea", "Es una chimenea hecha de ladrillos y muy elegante.");
				p.GD_CreateMsg ("es", "hay_madera", "Entre los restos del fuego encuentras un trozo de madera.");

				p.CA_ShowMsg ("desc_chimenea");
				if ( (p.IT_GetLoc (p.IT_X("madera")) == p.IT_X("limbo")) && (p.IT_GetLoc (p.IT_X("estaca")) == p.IT_X("limbo")) ) {
					p.CA_ShowMsg ("hay_madera");
					p.IT_SetLoc(p.IT_X("madera"), p.PC_GetCurrentLoc());
				}
				p.CA_ShowMsgAsIs ("<br/>");
				return true;
			}

			if (par_c.item1Id == "cama") {
				if (p.IT_GetLoc (p.IT_X("sábanas")) == p.IT_X("limbo")) {
					p.IT_SetLoc(p.IT_X("sábanas"), p.PC_GetCurrentLoc());
				}
				return false;
			}

			if (par_c.item1Id == "sábanas") {
				p.GD_CreateMsg ("es", "desc_sábanas", "Sábanas corrientes y molientes.");
				p.GD_CreateMsg ("es", "hay_llavecita", "Entre ellas encuentras una pequeña llavecita.");

				p.CA_ShowMsg ("desc_sábanas");
				if (p.IT_GetLoc (p.IT_X("llave")) == p.IT_X("limbo")) {
					p.CA_ShowMsg ("hay_llavecita");
					p.IT_SetLoc(p.IT_X("llave"), p.PC_GetCurrentLoc());
				}
				p.CA_ShowMsgAsIs ("<br/>");
				return true;
			}

			if (par_c.item1Id == "armario_pequeño") {
				p.GD_CreateMsg ("es", "armario_abierto", "El armario está abierto.");
				p.GD_CreateMsg ("es", "armario_cerrado", "Está cerrado con llave.");

				if (p.IT_GetLoc (p.IT_X("llave")) == p.IT_X("limbo")) {
					p.CA_ShowMsg ("armario_cerrado");
				} else {
					p.CA_ShowMsg ("armario_abierto");
				}
				p.CA_ShowMsgAsIs ("<br/>");
				return true;
			}

			// mostrar imagen
			// excepciones: ataud, barril, chimenea, mesa, silla, adornos, trofeos, horno
			if ( (par_c.item1Id != "ataud") &&
				 (par_c.item1Id != "barril") &&
				 (par_c.item1Id != "chimenea") &&
				 (par_c.item1Id != "mesa") &&
				 (par_c.item1Id != "silla") &&
				 (par_c.item1Id != "adornos") &&
				 (par_c.item1Id != "trofeos") &&
				 (par_c.item1Id != "horno") ) {
				p.CA_ShowImg (par_c.item1Id + ".jpg", true);
			}

			return false;
		}

	});


	reactions.push ({
		id: 'go',

		reaction: function (par_c) {

			return false;
		}


	});

	reactions.push ({
	id: 'open',

	reaction: function (par_c) {

		// to-do: imágenes de las localidades (porque el kernel no lo pemite)
		p.CA_ShowImg (par_c.item1Id + ".jpg", true);

		return false;
	}

});


}

// to-do: afterDescription , para mostrar imagen de localidad al entrar
/* to-do: uncomment!

export afterDescription = function (target) {

	p.CA_ShowImg (p.IT_GetId (target) + ".jpg", true);
}
*/


// **********************************************
//Section 2: gameAttribute
// **********************************************

let initAttributes =  function  (attributes, p) {

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

let initItems =  function  (items, p) {


}
