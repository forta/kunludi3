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

Paa "primera vez", mejor usar isKnown.

sala_baile.generalState.state: 0: primera vez (inicio); 1: siguientes (vuelves a la sala)
hall.generalState.state: 6; contador de número de partidas en que vas/vienes del hall (si llega a cero, la prota acaba desnuda; a -6:muerta)
comedor.generalState.state: 0: primera vez; 1: siguientes veces
pasillo_superior.state:0: primera vez, 1:siguientes
laboratorio.generalState.state: 0: primera vez; 1: siguientes
despacho.generalState.state: 0: primera vez; 1: siguientes de turnos
consigna_seguridad.generalState.state: 0: primera vez; 1: siguientes de turnos

raton.generalState.state: 0; +3: muere; siempre >=0
quimico.generalState.state: 0: no examinado
cuadro_eléctrico.generalState.state: 0: desconocido; 1:bajado; 2:subido


*/

let reactionList = [];
let primitives, libReactions

let reactions = []
let attributes = []
let items = []

let usr = {}

// local variables
usr.ropa = ["bolso", "collar", "chaqueta", "manga", "falda", "camisa", "sujetador", "bragas"]

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

	reactions.push ({

		id: 'examine_darkness',

		enabled: function (indexItem,indexItem2) {
			return usr.aOscuras()
		},

		reaction: function (par_c) {

			if (primitives.PC_GetCurrentLoc() == primitives.IT_X("sala_baile")) {
				primitives.GD_CreateMsg ("es", "arrastrada_sb", "Te arrastras por los suelos buscando algo que te pueda valer, pero sólo consigues cortarte con cristales rotos y que gente rabiosa te dé alguna patada que otra.");
				primitives.CA_ShowMsg ("arrastrada_sb");
				return true;
			}
			primitives.GD_CreateMsg ("es", "arrastrada_genérico", "Tus manos inquisidoras sólo consiguen llenarse de más sangre.");
			primitives.CA_ShowMsg ("arrastrada_genérico");
			return true;

		}

	});


	// saltar, de lib, deshabilitado
	reactions.push ({

		id: 'jump',

		enabled: function (indexItem, indexItem2) {
			return false
		}

	});

	// cantar, de lib, deshabilitado
	reactions.push ({

		id: 'sing',

		enabled: function (indexItem, indexItem2) {
			return false
		}

	});

	// look, de lib, deshabilitado
	reactions.push ({

		id: 'look',

		enabled: function (indexItem, indexItem2) {
			return false
		}

	});

	// wait, de lib, deshabilitado
	reactions.push ({

		id: 'wait',

		enabled: function (indexItem, indexItem2) {
			return false
		}

	});

	// plantilla de menú
	reactions.push ({
		id: 'xxxx',

		reaction: function (par_c) {

			var currentLoc = primitives.PC_GetCurrentLoc()


			if (currentLoc == primitives.IT_X("sala_baile")) {

				if (typeof par_c.option == 'undefined') { // phase 1: asking dialog

					primitives.GD_CreateMsg ("es", "bienvenida_juego", "Intro.<br/>");
					primitives.GD_CreateMsg ("es", "choose_salir_sala_baile", "salir de la sala de baile");
					primitives.GD_CreateMsg ("es", "choose_buscar_suelos", "buscar por los suelos");

					primitives.CA_ShowMsg ("bienvenida_juego");

					var menu = [{id:"opt_salir_sala_baile",msg:"choose_salir_sala_baile"}, {id:"opt_salir_sala_baile", msg:"choose_buscar_suelos"}];
					primitives.CA_ShowMenu (menu); // continuation in state == 0, phase 2

					return true;

				} else {

					if (par_c.option == "choose_salir_sala_baile") {

						primitives.GD_CreateMsg ("es", "sales", "sales<br/>");
						primitives.CA_ShowMsg ("sales");
						primitives.IT_SetLoc (primitives.IT_X("anita"), primitives.IT_X("hall"));

						return true;

					} else {

						primitives.GD_CreateMsg ("es", "muerte_baile", "mueres en la pista de baile (gore scene)<br/>");
						primitives.CA_ShowMsg ("muerte_baile");

						primitives.CA_EndGame ("Se acabó la fiesta.");

						return true;

					}

				}

			}


		}

	});


	reactions.push ({
		id: 'go',

		// to-do: las transiciones streaptease de la chica (y si lleva libro se lo quitan)
		/*
			Acción: go(source, target)
			Precondicción:  source == "sala_baile" && target == "hall"
			Reacción: { transición ("sala_baile", "hall"), continueDefaultAction }


			Acción: go(source, target)
			Precondicción: source == "hall" && target == "comedor" && x_firsttime(target)
			Reacción: {desc "flashback primera vez"}

			Acción: go(source, target)
			Precondicción:& source == "hall" && target == "consigna_seguridad" & x_firsttime(target)
			Reacción: { menu = usr.getChoicesConsigna() }

			Acción: go(source, target)
			Precondicción: source == "hall" && target == "consigna_seguridad" && not x_firsttime(target) && usr_movileEncendido()
			Reacción: { escena "Rabioso ataca la fuente de luz", endGame}

		*/

		reaction: function (par_c) {
			if (par_c.loc == primitives.IT_X("sala_baile")) {
				primitives.GD_CreateMsg ("es", "sales_sala_baile", "Alguien te intenta impedir la salida y te arranca una penda de ropa, pero consigues salir.<br/>")
				primitives.CA_ShowMsg ("sales_sala_baile");
				return false
			}

			if (par_c.loc == primitives.IT_X("hall") && par_c.target == primitives.IT_X("pasillo_superior"))  {
				primitives.GD_CreateMsg ("es", "subes", "Afortunadamente los rabiosos parecen ser muy ruidosos también y te vale evitar sus gemidos para no caer en sus brazos. Llegas a la planta alta, pero la luz ya no se encuentra ahí arriba.<br/>")
				primitives.CA_ShowMsg ("subes");
				return false
			}

			if (par_c.loc == primitives.IT_X("hall") && par_c.target == primitives.IT_X("comedor"))  {
				// to-do: sólo la primera vez
				primitives.GD_CreateMsg ("es", "recuerdo", "Entre sombras atraviesas el arco. Han pasado apenas dos horas desde el momento en que atravesásteis la alfombra roja desde el rolls que os recogió en el yate privado como si fuérais estrellas de Hollywood. Las fuertes medidas de seguridad te hicieron entonces temblar las piernas y tuviste entre ganas de salir corriendo y una gran excitación sexual imagiándote una orgía glamurosa rodeada de champán y caviar del caro.<br/><br/>¡Pero céntrate, piensa! Lo que de verdad te llamó la atención fueron las dichosas pastillitas. En cada sitio de las mesas junto con los cubiertos había dos documentos. En uno te comprometías a guardar silencio y te prometía una viaje sensorial memorable que haría efecto después de la cena si probabas las pastillas: a más pastillas, mayor intensidad de la experiencia. En el otro documento también te comprometías a no hablar, pero te invitaban a abandonar la mansión después de cenar, sin probar las pastillas. Unos impecables camareros uniformados de librea iban repartiendo los preciosos pastilleros a cambio del primer documento firmado. De entre el medio centenar de invitados, muy pocos se retiraron de sus asientos.<br/>")
				primitives.CA_ShowMsg ("recuerdo");
				return false
			}

			if (par_c.loc == primitives.IT_X("hall") && par_c.target == primitives.IT_X("exterior_mansión"))  {

				primitives.GD_CreateMsg ("es", "no_puedes_salir", "La robusta puerta de salida está aguantando las embestidas de varios rabiosos que se pelean entre sí por momentos o colaboran a ratos para intentar abrirla y salir fuera de la mansión. No es muy seguro acercarse a esa puerta por el momento.<br/>")
				primitives.CA_ShowMsg ("no_puedes_salir");
				return true
			}

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
		id: 'sala_baile',
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
		id: 'hall',
		desc: function () {
			primitives.GD_CreateMsg ("es", "hall_desc_1", "El ruido de gritos te rodea por todas partes. Desde este hall de acceso a la pista de baile suben las magníficas escaleras que tanto te llamaron la atención cuando llegaste, flanqueadas entonces por unos guardias de seguridad armario. Un arco interior a tu izquierda da al grandioso comedor donde os ofrecieron la cena. A la derecha estaba la consigna donde tuvísteis que dejar los móviles y la puerta que da al exterior de la mansión.");

			primitives.GD_CreateMsg ("es", "hall_desc_2", "<br/>A todas estas, ¿dónde están tus amigos? Petra y Groe sabes que estaban en la pista de baila haciendo el tonto y te temes lo peor. Luis había salido con Belma a fumar algo de maría a los jardines de la casa. El resto de la tropa eran meros conocidos y no te preocupan tanto.<br/>En algunos puntos ves fuentes de luz. Se ve que algunos se las ingeniaron para pasar móviles de estrangis. Una luz se mueve a lo alto, escaleras arriba.");

			primitives.CA_ShowMsg ("hall_desc_1");
			if (!primitives.IT_GetIsItemKnown(primitives.PC_X(), this.index)) { // primera vez
				primitives.CA_ShowMsg ("hall_desc_2");
			} else { // siguientes veces
			}
		}
	});


	items.push ({
		id: 'pasillo_superior',
		desc: function () {
			primitives.GD_CreateMsg ("es", "pasillo_superior_desc_1", "Desde aquí arriba estás relativamente segura mientras no hagas nada que te delate a los rabiosos que están en la planta baja.  Descubres tanteando que sólo hay dos puertas, una a cada extremo del pasillo");

			if (!primitives.IT_GetIsItemKnown(primitives.PC_X(), this.index)) { // primera vez
				primitives.CA_ShowMsg ("pasillo_superior_desc_1");
			} else { // siguientes veces
				primitives.CA_ShowMsg ("pasillo_superior_desc_1");
				// to-do: decir si aparece el químico
			}
		}
	});

	items.push ({
		id: 'laboratorio',
		desc: function () {
			// transición del primer intento de entrar
			primitives.GD_CreateMsg ("es", "laboratorio_desc_1", "Al abrir la puerta, un rabioso la empuja y te arrolla pateándote pero sin detenerse en ti. El muy imbécil se tropieza con algo y se golpea contra algo del pasillo, quedando inconsciente -> la carta")

			// en realidad, transición al entrar la primera vez
			primitives.GD_CreateMsg ("es", "laboratorio_desc_2", "Sorpresivamente no hay nadie y al darle por costumbre al interruptor de la entrada se enciende una luz. Oyes como varios rabiosos comienzan a subir las escaleras en dirección a la luz que sale de la habitación. Cierras la puerta y evitas que entren por los pelos");
			// to-do: que el jugador cierre la puerta

			primitives.GD_CreateMsg ("es", "laboratorio_desc_con_luz", "<br/>Es un laboratorio con sistema eléctrico aparte. Muchos artefactos, animales en jaulas, etc");

			primitives.GD_CreateMsg ("es", "laboratorio_desc_sin_luz", "<br/>Agazapada en un rincón sólo oyes y hueles a los animales de experimentación.");

			// Si estás con la luz apagada y abres la puerta abierta: dos rabiosos llegan a la puerta, uno mata al otro y se va.

			// si  luz
			primitives.CA_ShowMsg ("laboratorio_desc_con_luz");
			// to-do: no luz
			//primitives.CA_ShowMsg ("laboratorio_desc_sin_luz");
		}
	});

	items.push ({
		id: 'despacho',
		desc: function () {
			// en realidad, reacción de movimiento, que no se llega a producir y te propone menú.
			//primitives.GD_CreateMsg ("es", "despacho_desc_1", "Una luz que te ciega se te aproxima. Menú: [huyes, peleas]<br/>")
			// esto es transición al entrar las siguientes veces
			//primitives.GD_CreateMsg ("es", "despacho_desc_1", "La chica enreabre la puerta y te deja entrar");

			primitives.GD_CreateMsg ("es", "despacho_desc_1", "En el despacho del piso superior. La chica, muda por lo que se ve, está acurrucada en un rincón");

			primitives.CA_ShowMsg ("despacho_desc_1");
			// to-do: si tiene el móvil: "jugando con el móvil"
		}
	});

	items.push ({
		id: 'consigna_seguridad',
		desc: function () {
			// transición al intentar entrar según según haya o no luz y haya o no un rabioso,
			primitives.GD_CreateMsg ("es", "consigna_seguridad_desc_1", "<br/>Hay un rabioso dentro dándose cabezazos contra un armario. Menos mal que no te ha visto entrar. menu: [salir, atacar al rabioso]")
			primitives.GD_CreateMsg ("es", "consigna_seguridad_desc_2", "La sala está en silencio pero no ves nada a oscuras. menú: [salir, explorar a oscuras -> un teléfono sin línea y un armario con candado.]")
			primitives.GD_CreateMsg ("es", "consigna_seguridad_desc_3","Hay un robusto armario cerrado con un candado, un cuadro de luces con la palanca bajada y un teléfono fijo.");

			// si rabioso
			primitives.CA_ShowMsg ("consigna_seguridad_desc_1");
			// to-do: si no luz
			//primitives.CA_ShowMsg ("consigna_seguridad_desc_2");
			// to-do: si luz (y sin rabioso)
			//primitives.CA_ShowMsg ("consigna_seguridad_desc_3");
			// to-do: según si el armario está abierto o no

		}
	});

	items.push ({
		id: 'comedor',
		desc: function () {
			primitives.GD_CreateMsg ("es", "comedor_desc_1", "Y hete aquí, pegada al arco de entrada sin atreverte a entrar más adentro. Los gritos de peleas y persecusiones continúan, junto con el ruido de sillas y mesas que se arrastran y se tiran de un lado a otro. Quedarse aquí no es muy seguro.");

			primitives.CA_ShowMsg ("comedor_desc_1");
		}
	});

	items.push ({
		id: 'exterior_mansión',
		desc: function () {
			primitives.GD_CreateMsg ("es", "exterior_mansión_desc_1", "exterior_mansión desc");
			if (!primitives.IT_GetIsItemKnown(primitives.PC_X(), this.index)) { // primera vez
				primitives.CA_ShowMsg ("exterior_mansión_desc_1");
			} else { // siguientes veces
				primitives.CA_ShowMsg ("exterior_mansión_desc_1");
			}
		}
	});

}

// GENERIC turn **********************************************************************************************

function turn (indexItem) {

	var  primitives = this.primitives // tricky

	// hall
	if (indexItem == primitives.IT_X("hall")) {
		usr.turnoHall()

		usr.debug()
	}



}

// internal functions ****************************************************************************************************************

/*

	usr.getChoicesConsigna():
		menu = ["salir"]
		if (loc("bruto") == "consigna_seguridad") menu.push ("pelear")
		if (usr.aOscuras()) menu.push ("explorar a tientas")
		return menu
*/

usr.turnoHall = function () {

	var primitives = this.primitives // tricky
	var turnosHall = +primitives.IT_GetAttPropValue (primitives.IT_X("hall"), "generalState", "state")

	primitives.IT_SetAttPropValue (primitives.IT_X("hall"), "generalState", "state", turnosHall +1)
}


usr.debug = function () {

	var primitives = this.primitives // tricky
	var turnosHall = +primitives.IT_GetAttPropValue (primitives.IT_X("hall"), "generalState", "state")

	primitives.CA_ShowMsgAsIs ("<br/>");
	primitives.GD_CreateMsg ("es", "debug_1", "Debug - turnosHall: %s1<br/>");
	primitives.CA_ShowMsg ("debug_1", {s1: turnosHall });


}

usr.aOscuras = function () {
	// to-do: cuadro_eléctrico == 1, o bien usr.móvilEncendido()
	// 	usr.aOscuras(): usr.palancaBajada() && !usr.movilPresenteyEncendido()

	return true
}

// 	usr_movileEncendido(): 	return att("mobile.state") == "true"
