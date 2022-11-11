"use strict";

//Section 1a: gameReaction (lib overwrite)
//Section 1b: gameReaction (game actions)
//Section 2: gameAttribute
//Section 3: gameItems
//Section 4: internal functions

/*
Atributos usados en el juego:

*/

let items = []
let reactions = []
let attributes = []
let userFunctions = []

export default {
	dependsOn:dependsOn,
	turn: turn,
	initItems: initItems,
	initReactions: initReactions,
	initAttributes: initAttributes,
	initUserFunctions:initUserFunctions,
	items:items,
	reactions:reactions,
	attributes:attributes,
	userFunctions:userFunctions,
	exec:exec
}

function dependsOn (lib, usr) {
	this.lib = lib
	this.usr = usr
	initUserFunctions(lib, usr)

}

function turn (indexItem) {

	if (indexItem != this.lib.exec ("x", ["hall"])) return
	if (this.lib.exec ("getValue", {id:"intro2"}) == "1") return
	if (this.usr.exec ("escenas_pendientes") != "done") return
	this.usr.exec ("escenaFinal")

}

function exec(functionName, par) {

	let indexUsrFunction = this.lib.arrayObjectIndexOf_2(this.userFunctions, "id", functionName);
	if (indexUsrFunction<0) {
		console.log ("missing functionName [" + functionName + "] in executeCode")
		return
	}
  return userFunctions[indexUsrFunction].code (par)
}

function initItems (lib, usr) {

	items.push ({
		id: 'intro0',

		desc: function () {

			lib.out ("EnableChoices", [false])

			lib.GD_CreateMsg ("es","tecla","avanza")

			lib.GD_ResetLinks ()

			lib.GD_CreateMsg ("es","Intro0", "Bienvenido al juego Intruso, participante en la %l1.<br/>Correcciones hechas a fecha de 17 de noviembre, disculpen los bugs previos y gracias por los comentarios!<br/>");
			let intro0 = lib.out ("showMsg", ["Intro0",{l1: {id: "intro0", txt: "ectocomp 2021"}}]);
			lib.GD_addLink({ id:intro0, url: "https://itch.io/jam/ectocomp-2021-espanol"})

			lib.GD_CreateMsg ("es","Intro2", "Pero si ya las conoces, puedes empezar a %l1 directamente.<br/>");
			let intro2 = lib.out ("showMsg", ["Intro2",{l1: {id: "intro2", txt: "jugar"}}]);
			lib.GD_addLink({ id:intro2, visibleToFalse: [intro1], changeTo: intro3, action: { choiceId: "action", actionId:"goto", o1Id: "intro1"} })

			lib.GD_CreateMsg ("es","tecla","avanza")

			lib.GD_CreateMsg ("es","Intro0", "Bienvenido al juego Bailando<br/>");
			lib.out ("showMsg", ["Intro0"]);

		}

	});

	items.push ({
		id: 'intro1',

		desc: function () {

			lib.GD_CreateMsg ("es","Intro1", "Intro1<br/>");
			let intro1 = lib.out ("showMsg", ["Intro1"]);

		}

	});


}

function initReactions (lib, usr) {

	// acciones de lib deshabilitadas
	reactions.push ({ id: 'jump', enabled: function (indexItem, indexItem2) {		return false		}	});
	reactions.push ({ id: 'sing', enabled: function (indexItem, indexItem2) {		return false		}	});
	reactions.push ({ id: 'wait', enabled: function (indexItem, indexItem2) {		return false		}	});

	reactions.push ({
		id: 'goto',

		reaction: function (par_c) {

			if (typeof par_c.option == 'undefined') {
				lib.GD_CreateMsg ("es","Intro0", "Bienvenido al juego Bailando<br/>");
				lib.out ("showMsg", ["Intro0"]);

				var menu = [{id:"opción1",msg:"opción1"}, {id:"opción2", msg:"opción2"}];
				primitives.CA_ShowMenu (menu); // continuation in state == 0, phase 2
			} else {
				if (par_c.option == "opción1") { // versión reducida
					lib.GD_CreateMsg ("es","Opción1", "opción1<br/>");
					lib.out ("showMsg", ["Opción1"]);
				} else {
					lib.GD_CreateMsg ("es","Opción2", "opción2<br/>");
					lib.out ("showMsg", ["Opción2"]);

				}

			}

			/*
			if ((par_c.loc == lib.exec("x",["intro2"])) && (par_c.item1Id == "porche"))  {
				lib.GD_CreateMsg ("es", "de_intro_a_porche", "Trastabillas y te caes, te arañas con los arbustos, y casi pierdes el móvil, pero llegas hasta el porche y recuperas el aliento.<br/>");
				lib.out ("showMsg", ["de_intro_a_porche"])
				lib.GD_CreateMsg ("es","mira","mira")
				lib.out ("PressKey", ["mira"]);
				return false // go to the location and show description
			}
			*/

		}

	}); // go-to


}


function initAttributes (lib, usr) {

}

function initUserFunctions (lib, usr) {

	userFunctions.push ({
		id: 'setFrame', // se podría llamar afterClick; to-do: pendiente un mecanismo para refrescar comportamientos después de cambio automático de variable afectado por activatedBy
		code: function (par) { // par.pnj
				let status = {}

				//lib.out ("EnableChoices", [true])
			  console.log ("usr.setFrame: " + JSON.stringify (par))

				let familiaActivation = [
					(lib.exec ("getValue", ["cuadro1", "familiaState.padre"]) == "0"),
					(lib.exec ("getValue", ["cuadro1", "familiaState.madre"]) == "0"),
					(lib.exec ("getValue", ["cuadro1", "familiaState.chica"]) == "0"),
					(lib.exec ("getValue", ["cuadro1", "familiaState.niño"]) == "0"),
					(lib.exec ("getValue", ["cuadro1", "familiaState.abuelo"]) == "0"),
					(lib.exec ("getValue", ["cuadro1", "familiaState.abuela"]) == "0") ]

				let bis_active = !(familiaActivation[0] || familiaActivation[1] || familiaActivation[2] || familiaActivation[3] || familiaActivation[4] || familiaActivation[5])

				/*
				// si se han visto ya todos, mostrar opciones habituales
				if (bis_active) {
					//lib.out ("EnableChoices", [false])
			    status.enableChoices = true
			  }
				*/

				return status
			}
	});

}
