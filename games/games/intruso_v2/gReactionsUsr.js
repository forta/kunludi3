"use strict";

//Section 1a: gameReaction (lib overwrite)
//Section 1b: gameReaction (game actions)
//Section 2: gameAttribute
//Section 3: gameItems
//Section 4: internal functions

/*
Atributos usados en el juego:

porche
hab_padres: 1 cuando haya observado el espejo
hab_niños: 1 cuando haya dado queso al ratónote
hab_abuelo: 1 cuando haya entrado en el ataúd
cuadro1: 1 cuando lo haya observado
chimenea: 1 cuando haya observado la chimenea
dinamita.loc: en limbo significa que ha vivido la escena de la guerra
poster: 1 cuando ha leído la canción del póster
botella: 1 abierta; 2 cuando te has huntado las manos con la sangre

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
	id: 'intro1',

	desc: function () {

		lib.out ("EnableChoices", [false])

		lib.GD_CreateMsg ("es","tecla","avanza")

		lib.GD_ResetLinks ()

		lib.GD_CreateMsg ("es","Intro0", "Bienvenido al juego Intruso, participante en la %l1.<br/>Correcciones hechas a fecha de 17 de noviembre, disculpen los bugs previos y gracias por los comentarios!<br/>");
		let intro0 = lib.out ("showMsg", ["Intro0",{l1: {id: "intro0", txt: "ectocomp 2021"}}]);
		lib.GD_addLink({ id:intro0, url: "https://itch.io/jam/ectocomp-2021-espanol"})

		lib.GD_CreateMsg ("es","Intro1", "Antes de comenzar el juego, hay algunas %l1 que deberías conocer previamente.<br/>");
		lib.GD_CreateMsg ("es","Intro2", "Pero si ya las conoces, puedes empezar a %l1 directamente.<br/>");
		let intro1 = lib.out ("showMsg", ["Intro1",{l1: {id: "intro1", txt: "consideraciones de jugabilidad"}}]);
		let intro2 = lib.out ("showMsg", ["Intro2",{l1: {id: "intro2", txt: "jugar"}}]);
		lib.GD_addLink({ id:intro1, visibleToFalse: [intro2], changeTo: consi0})

		lib.GD_CreateMsg ("es","Intro3", "Disfruta de la partida.<br/>");
		let intro3 = lib.out ("showMsg", ["Intro3", undefined, false]); // visible: false, changed by a link
		lib.GD_addLink({ id:intro2, visibleToFalse: [intro1], changeTo: intro3, action: { choiceId: "action", actionId:"goto", o1Id: "intro2"} })

		lib.GD_CreateMsg ("es", "Consideración0", "Si ya has jugado anteriormente a juegos desarrollados con el motor de kunludi ya sabrás que la interacción se realiza con las opciones disponibles después del texto de la última reacción. Cuando la acción no es directa, primero tienes que seleccionar el objeto sobre el que quieres actuar y luego la acción a desarrollar.%l1<br/>");
		lib.GD_CreateMsg ("es", "Consideración1", "En esta versión del motor, se han incorporado enlaces en los textos, simulando un poco el estilo Twine/Inkle. %l1<br/>");
		lib.GD_CreateMsg ("es", "Consideración2", "También se ha incorporado un filtro para los los ítems y acciones disponibles. Si pulsas 'enter' mientras editas el filtro, se ejecutará la primera de las opciones disponibles. Es una forma muy dinámica de interacturar (al menos por web) y te animamos a usarla.%l1<br/>");
		let consi0 = lib.out ("showMsg", ["Consideración0",{l1: {id: "consi0", txt: "sigue leyendo"}}, false])
		let consi1 = lib.out ("showMsg", ["Consideración1",{l1: {id: "consi1", txt: "sigue leyendo"}}, false])
		let consi2 = lib.out ("showMsg", ["Consideración2",{l1: {id: "consi2", txt: "El juego comienza"}}, false])
		lib.GD_addLink({ id:consi0, changeTo: consi1})
		lib.GD_addLink({ id:consi1, changeTo: consi2})
		lib.GD_addLink({ id:consi2, changeTo: intro3, 	action: { choiceId: "action", actionId:"goto", o1Id: "intro2"}})

	}

});

items.push ({
	id: 'intro2',

	desc: function () {

		lib.GD_CreateMsg ("es", "escena_inicial_1", "Es sólo entrar y salir. Localizar el dichoso trofeo, sacarle una foto y salir pitando.<br/>");
		lib.GD_CreateMsg ("es", "escena_inicial_2", "Sabes que la familia Rarita va a salir a celebrar la noche de Halloween fuera de casa. Escondido detrás de un arbusto en su ruinoso jardín, los acabas de ver desfilar delante tuyo, con unas pintas que por una vez al año no desentona con la del resto.<br/>")
		lib.GD_CreateMsg ("es", "escena_inicial_3", "¿Cómo has podido dejarte enredar en esto?<br/>");

		lib.out ("showMsg", ["escena_inicial_1"])
		lib.out ("showMsg", ["escena_inicial_2"])
		lib.out ("showMsg", ["escena_inicial_3"])

		lib.out ("PressKey", ["tecla"]);

		lib.GD_CreateMsg ("es", "flashback_1", "Flashback. Ayer noche. Reunión semanal de colegas de rol-o-lo-que-surja<br/>");
		lib.GD_CreateMsg ("es", "flashback_21", "Bela: Venga, tira tu carta ya, ¡que nos aburrimos! No seas gallina, no creo que te vaya a salir 'desafío'.<br/>")
		lib.GD_CreateMsg ("es", "flashback_22", "Lanzas las cartas y...<br/>")
		lib.GD_CreateMsg ("es", "flashback_23", "Tú: ¿¡Qué...!? La muy de Bela, gafe no, gafona, pájaro de mal agüero.<br/>")
		lib.GD_CreateMsg ("es", "flashback_24", "Todos (voces solapadas): ¡No jodas! ¡Bien! ¡Ya era hora de que te tocara! ¡Somos ricos!<br/>")
		lib.GD_CreateMsg ("es", "flashback_25", "Tú: Un momento. aún tengo una oportunidad.<br/>")
		lib.GD_CreateMsg ("es", "flashback_26", "Truda: Tú sueñas. Vamos equipo, a deliberar. Tú, por favor, sale de la habitación un momento.<br/>")
		lib.GD_CreateMsg ("es", "flashback_31", "Por mucho que pegaste el oído a la puerta sólo oíste sus risas. Luego, cuando volviste a entrar:<br/>")
		lib.GD_CreateMsg ("es", "flashback_32", "Fiulo: Hemos decidido que si quieres retener tu mazo de cartas deberás superar este reto:<br/>")
		lib.GD_CreateMsg ("es", "flashback_4", "Tienes que entrar en la casa de Los Raritos y salir con una foto de la mascota del menor de La Familia Rarita.<br/>")
		lib.GD_CreateMsg ("es", "flashback_5", "Sales de tu ensimismamiento.<br/>");
		lib.GD_CreateMsg ("es", "flashback_6", "Ahora que acaban de subirse a su coche fúnebre de cristales oscuros, sabes que ha llegado el momento de entrar. Tu corazón late a mil por hora, los músculos se tensan, así que...<br/>")

		lib.out ("showMsg", ["flashback_1"])
  	lib.out ("PressKey", ["tecla"]);
		lib.out ("showMsg", ["flashback_21"])
		lib.out ("showMsg", ["flashback_22"])
		lib.out ("showMsg", ["flashback_23"])
		lib.out ("showMsg", ["flashback_24"])
		lib.out ("showMsg", ["flashback_25"])
		lib.out ("showMsg", ["flashback_26"])
		lib.out ("PressKey", ["tecla"]);
		lib.out ("showMsg", ["flashback_31"])
		lib.out ("showMsg", ["flashback_32"])
		lib.out ("PressKey", ["tecla"]);
		lib.out ("showMsg", ["flashback_4"])
		lib.out ("PressKey", ["tecla"]);
		lib.out ("showMsg", ["flashback_5"])
		lib.out ("PressKey", ["tecla"]);
		lib.out ("showMsg", ["flashback_6"])

		lib.GD_CreateMsg ("es", "corre", "¡%l1!<br/>")
		let msg_corre = lib.out ("showMsg", ["corre",{l1: {id: "corre", txt: "CORRE"}}])

		lib.GD_ResetLinks ()
		lib.GD_addLink(	{ id: msg_corre, 	action: { choiceId: "action", actionId:"goto", o1Id: "porche"}} )
	}

});

items.push ({
	id: 'porche',

	desc: function () {

		lib.GD_CreateMsg ("es","desc-porche-1", "Las telarañas del sofá colgante son frondosas, pero no decorativas precisamente. Si aquí en el exterior está todo tan mugriento, no quieras ni imaginarte cómo estarán las cosas %l1.<br/>");
		let dentro = lib.out ("showMsg", ["desc-porche-1",{l1: {id: "dentro", txt: "dentro"}}])

		if (lib.exec ("getValue", [this.id]) == "0") {  // primera vez
			lib.GD_CreateMsg ("es","desc-porche-2", "Sólo estás armado con el %l1 vintage que te dejaron tus amigos.<br/>");

			let msg_movil = lib.out ("showMsg", ["desc-porche-2",{l1: {id: "móvil", txt: "móvil"}}]);

			lib.GD_ResetLinks ()
			lib.GD_addLink (	{ id:dentro, action: { choiceId: "dir1", actionId:"go", d1Id:"in", target: lib.exec ("x", ["hall"]), targetId: "hall", d1Id:"in", d1: lib.exec ("getDir", ["in"])}} )
			lib.GD_addLink (  { id:msg_movil, action: { choiceId: "obj1", o1Id: "móvil"}} )

			lib.GD_CreateMsg ("es","desc-porche-3", "Por el rabillo del ojo vez algo deslizarse. Al enfocar  la vista ves un surco sobre el descuidado césped que va desde donde viste el movimiento hasta un agujero debajo de una de las paredes externas de la casa.<br/>");
			lib.out ("showMsg", ["desc-porche-3"])
			lib.exec ("setLoc", ["móvil", lib.exec ("pc")] )
			lib.exec ("setValue", [this.id, "1"])

			lib.out ("EnableChoices", [true])
		} else {
			lib.GD_ResetLinks ()
			lib.GD_addLink ( { id:dentro, action: { choiceId: "dir1", actionId:"go", d1Id:"in", target: lib.exec("x",["hall"]), targetId: "hall", d1Id:"in", d1: lib.exec ("getDir", ["in"])}} )
		}

	}

});

	items.push ({
		id: 'hall',

		desc: function () {

			// lib.GD_ResetLinks ()

			// debug: sólo por si en pruebas empezamos aquí.
			lib.GD_CreateMsg ("es","tecla","avanza")
			lib.exec ("setLoc", ["móvil", lib.exec ("pc")])

			lib.GD_CreateMsg ("es","desc_hall_0", "Dejas detrás de ti la puerta exterior. Sabes que salir representa resignarte a la burla de tus amigos y perder tu fabuloso mazo de cartas.<br/>");
			lib.out ("showMsg", ["desc_hall_0"]);

			let huesosVisto = (lib.exec("getValue", {id:"huesos"}) != "0")

			lib.GD_CreateMsg ("es","desc_hall_1", "Una inmensa %l1 domina uno de los laterales del salón. ");
			let desc_hall_1 = lib.out ("showMsg", ["desc_hall_1",{l1:{id: "desc_hall_1", txt: "chimenea"}}])
			lib.GD_addLink (	{ id: desc_hall_1, action: { choiceId: "action", actionId:"ex", o1Id: "chimenea"}, activatedBy: "huesos"  } )

			lib.GD_CreateMsg ("es","desc_hall_a_cocina", "Por el otro lateral, atravesando el comedor, entrevés una puerta que seguramente %l1.<br/>");
			let desc_hall_a_cocina = lib.out ("showMsg", ["desc_hall_a_cocina",{l1:{id: "desc_hall_a_cocina", txt: "lleva a la cocina"}}])
			lib.GD_addLink (	{ id: desc_hall_a_cocina, action: { choiceId: "dir1", actionId:"go", target: lib.exec("x",["cocina"]), targetId: "cocina", d1Id:"d270", d1: lib.exec ("getDir", ["d270"])}} )

			lib.GD_CreateMsg ("es","desc_hall_2", "A través de un magnífica escalera con tapete, que sería rojo si no fuera por las marcas de %l1, ");
			lib.GD_CreateMsg ("es","desc_hall_2_plus", " no sólo de personas sino también de animales de distintos tamaños y que no identificas, ");
			let desc_hall_2 = lib.out ("showMsg", ["desc_hall_2",{l1:{id: "desc_hall_2", txt: "pisadas"}}])
			let desc_hall_2_plus = lib.out ("showMsg", ["desc_hall_2_plus",undefined, false])
			lib.GD_addLink (	{ id: desc_hall_2, visibleToTrue: [desc_hall_2_plus]} )

			lib.GD_CreateMsg ("es","desc_hall_3", " podrías %l1.");
			let desc_hall_3 = lib.out ("showMsg", ["desc_hall_3",{l1:{id: "desc_hall_3", txt: "ir a la planta alta"}}])
			lib.GD_addLink (	{id: desc_hall_3, action: { choiceId: "dir1", actionId:"go", target: lib.exec("x",["pasillo"]), targetId: "pasillo", d1Id:"up", d1: lib.exec ("getDir", ["up"])}} )

			lib.GD_CreateMsg ("es","interruptores_1", "Está todo bastante oscuro pero ves %l1 ");
			lib.GD_CreateMsg ("es","interruptores_2", "que están cubiertos de mugre pegajosa y no funcionan.<br/>");
			let msg_interruptores_1 = lib.out ("showMsg", ["interruptores_1",{l1:{id: "interruptores_1", txt: "algunos interruptores"}}])
			let msg_interruptores_2 = lib.out ("showMsg", ["interruptores_2", undefined, {visibleBy: "interruptores"}])
			lib.GD_addLink (	{ id: msg_interruptores_1, visibleToTrue: [msg_interruptores_2], activatedBy: "interruptores" } )
		}

	});

	items.push ({
		id: 'cocina',

		desc: function () {
			lib.GD_CreateMsg ("es","desc_cocina", "Es la cocina más nauseabunda que has visto en tu vida. Te da asco tocar nada, pero una curiosidad malsana te tienta a %l1.")
			let desc_cocina =  lib.out ("showMsg", ["desc_cocina",{l1:{id: "desc_cocina", txt: "mirar qué habrá dentro de la nevera"}}])

			lib.GD_ResetLinks ()
			lib.GD_addLink (	{id: desc_cocina, action: { choiceId: "action", actionId:"ex", o1Id: "nevera"} } )

		}

	});

	items.push ({
		id: 'pasillo',

		desc: function () {

			let cuadroVisto = (lib.exec ("getValue", {id:"cuadro1"}) != 0)
			let posterVisto = (lib.exec ("getValue", {id:"póster"}) != 0)
			let espejoVisto = (lib.exec ("getValue", {id:"espejo"}) != 0)

			let ratonPresente = ( lib.exec ("getLocId", ["ratón"]) != "limbo")

			lib.GD_CreateMsg ("es","pasillo_cuadro", "Observas un %l1 con los miembros de la familia. ")
			lib.GD_CreateMsg ("es","pasillo_hab_común", "Sólo es un pasillo que conduce ");
			lib.GD_CreateMsg ("es","pasillo_hab_padres", " %l1 y sobre la que ves un escudo con un lobo que pelea con una serpiente casi tan grande como él; ");
			lib.GD_CreateMsg ("es","pasillo_hab_hijos", " %l1; ");
			lib.GD_CreateMsg ("es","pasillo_poster", ", supones por %l1 de un grupo de rock gótico a la entrada, ");
			lib.GD_CreateMsg ("es","pasillo_hab_abuelo", " y a una tercera habitación, sin nada digno de remarcar... salvo la ausencia de todo: una puerta lisa y negra, sin pomo.<br/>");

			let msg_pasillo_cuadro = lib.out ("showMsg", ["pasillo_cuadro",{l1: {id: "pasillo_cuadro", txt: "cuadro"}}, !cuadroVisto]);
			let msg_pasillo_hab_hijos_comun = lib.out ("showMsg", ["pasillo_hab_común"])

			let msg_pasillo_hab_padres = lib.out ("showMsg", ["pasillo_hab_padres",{l1: {id: "pasillo_hab_padres", txt: "a la habitación que preside las escaleras"}}, !espejoVisto ])

			let msg_pasillo_hab_hijos = lib.out ("showMsg", ["pasillo_hab_hijos",{l1: {id: "pasillo_hab_hijos", txt: "a la habitación de los hijos"}}, ratonPresente ])

			let msg_pasillo_poster = lib.out ("showMsg", ["pasillo_poster",{l1: {id: "pasillo_poster", txt: "el póster"}}, !posterVisto & ratonPresente])
			let msg_pasillo_hab_abuelo = lib.out ("showMsg", ["pasillo_hab_abuelo"])

			lib.GD_ResetLinks ()
			lib.GD_addLink (	{ id:msg_pasillo_cuadro, action: { choiceId: "action", actionId:"ex", o1Id: "cuadro1"}} )
			lib.GD_addLink (	{ id:msg_pasillo_poster, action: { choiceId: "action", actionId:"ex", o1Id: "póster"}, libCode: {functionId:'setValue', par: {id:"póster", value:"1"}} } )
			lib.GD_addLink (	{ id:msg_pasillo_hab_padres, action: { choiceId: "dir1", actionId:"go", target: lib.exec("x",["hab_padres"]), targetId: "hab_padres", d1Id:"d0", d1: lib.exec ("getDir", ["d0"])}} )
			lib.GD_addLink (	{ id:msg_pasillo_hab_hijos, action: { choiceId: "dir1", actionId:"go", target: lib.exec("x",["hab_hijos"]), targetId: "hab_hijos", d1Id:"d270", d1: lib.exec ("getDir", ["d270"])}} )

		}

	});

	items.push ({
		id: 'hab-padres',

		desc: function () {

			lib.GD_CreateMsg ("es","desc-hab-padres-1", "Qué desagradable, un crucifijo invertido preside una cama enorme, de unos tres por tres metros. La cama está sin hacer y las sábanas están llenas de manchas cuya naturaleza quizás sea mejor no saber. Un gran espejo en el techo habla de la morbosidad de sus ocupantes.<br/>");
			lib.out ("showMsg", ["desc-hab-padres-1"])

		}

	});

	items.push ({
		id: 'hab-hijos',

		desc: function () {

			// to-do: usar links
			// si das queso -> sale el ratón, coge queso, y se van ambos animales.
			// ¿qué pasa si no tienes el queso? En vez de resolverse la situación dando el queso, aparecería un objeto en la habitación que podrías usar ahí mismo: quizás debajo de la alfombra o similar.

			let ratonVisto = (lib.exec ("getValue",  {id:"ratón"}) != "0")
			let gatoVisto = (lib.exec ("getValue",  {id:"gato"}) != "0")

			lib.GD_CreateMsg ("es","desc-hab-hijos-1", "¿Una litera? No te quieres ni imaginar las peleas por el territorio entre los dos hermanos Raritos, que no dejan de pelear todo el rato en el colegio.<br/>");
			lib.GD_CreateMsg ("es","desc-hab-hijos-ratón", "Al lado de la cama inferior, hay un agujero del tamaño de una pelota de tenis en la base de la pared")
			lib.GD_CreateMsg ("es","desc-hab-hijos-ratón-presente", ", del que asoma el hocico de un %l1.");
			lib.GD_CreateMsg ("es","desc-hab-hijos-gato-presente", "En otra esquina de la habitación, entre sombras, un %l1 mira casi todo el tiempo hacia el agujero, ignorándote activamente mientras se lame las uñas. No lo podrías jurar, pero ¿tiene maquillaje en los ojos?<br/>");

			let ratonHay = lib.exec ("isHere", ["ratón"])
			let gatoHay = lib.exec ("isHere", ["gato"])

			lib.out ("showMsg", ["desc-hab-hijos-1"])
			lib.out ("showMsg", ["desc-hab-hijos-ratón"])
			let msg_raton_presente = lib.out ("showMsg", ["desc-hab-hijos-ratón-presente",{l1: {id: "ratoncito", txt: "ratoncito"}}, ratonHay & !ratonVisto])

			lib.out ("ShowMsgAsIs", [". "])


			let msg_gato_presente = lib.out ("showMsg", ["desc-hab-hijos-gato-presente",{l1: {id: "gato", txt: "gato"}}, gatoHay & !gatoVisto])

			lib.GD_ResetLinks ()
			lib.GD_addLink (	{ id: msg_raton_presente, action: { choiceId: "action", actionId:"ex", o1Id: "ratón"} } )
			lib.GD_addLink (	{ id: msg_gato_presente,  action: { choiceId: "action", actionId:"ex", o1Id: "gato"} } )

		}

	});

	items.push ({
		id: 'hab-abuelos',

		desc: function () {

			lib.GD_CreateMsg ("es","desc-hab-abuelos", "Suelo y paredes de mármol, gélido y un ataúd flanqueado por dos velas inmensas encendidas. Sobre el ataúd un cuadro.<br/>");
			lib.out ("showMsg", ["desc-hab-abuelos"])

		}

	});

	items.push ({
		id: 'cuadro1',


		desc: function () {

			lib.GD_CreateMsg ("es","el_cuadro_1", "La familia Rarita al completo: ");
			lib.out ("showMsg", ["el_cuadro_1"])
			lib.GD_ResetLinks ()

			lib.GD_CreateMsg ("es","el_cuadro_2", "el %l1, "); // enlace expandible
			lib.GD_CreateMsg ("es","el_cuadro_2_bis", "el Papá Rarito, con un lobo a sus pies; "); // bis: mensaje expandido
			let msg_cuadro_2 = lib.out ("showMsg", ["el_cuadro_2",{l1: {id: "cuadro_2", txt: "Papá Rarito"}}, {visibleBy: "cuadro1.familiaState.padre"}])
			let msg_cuadro_2_bis = lib.out ("showMsg", ["el_cuadro_2_bis",undefined, {visibleBy: "!cuadro1.familiaState.padre"} ])
			lib.GD_addLink (	{ id: msg_cuadro_2, changeTo: msg_cuadro_2_bis, userCode: {functionId: "setFrame", par: {pnj:"padre"} }, activatedBy: "cuadro1.familiaState.padre" } )

			lib.GD_CreateMsg ("es","el_cuadro_3", "la %l1, ");
			lib.GD_CreateMsg ("es","el_cuadro_3_bis", "la Mamá Rarita, con una serpiente inmensa como bufanda; ");
			let msg_cuadro_3 = lib.out ("showMsg", ["el_cuadro_3",{l1: {id: "cuadro_3", txt: "Mamá Rarita"}}, {visibleBy: "cuadro1.familiaState.madre"}])
			let msg_cuadro_3_bis = lib.out ("showMsg", ["el_cuadro_3_bis",undefined, {visibleBy: "!cuadro1.familiaState.madre"} ])
			lib.GD_addLink (	{ id: msg_cuadro_3, changeTo: msg_cuadro_3_bis, userCode: {functionId: "setFrame", par: {pnj:"madre"} }, activatedBy: "cuadro1.familiaState.madre" } )

			lib.GD_CreateMsg ("es","el_cuadro_4", "la %l1, ");
			lib.GD_CreateMsg ("es","el_cuadro_4_bis", "la Chica Rarita y su look gótico-punk, acariciando a un gato negro; ");
			let msg_cuadro_4 = lib.out ("showMsg", ["el_cuadro_4",{l1: {id: "cuadro_4", txt: "Chica Rarita"}}, {visibleBy: "cuadro1.familiaState.chica"}] )
			let msg_cuadro_4_bis = lib.out ("showMsg", ["el_cuadro_4_bis",undefined, {visibleBy: "!cuadro1.familiaState.chica"}])
			lib.GD_addLink (	{ id: msg_cuadro_4, changeTo: msg_cuadro_4_bis, userCode: {functionId: "setFrame", par: {pnj:"chica"} }, activatedBy: "cuadro1.familiaState.chica"	} )

			lib.GD_CreateMsg ("es","el_cuadro_5", "el %l1, y ");
			lib.GD_CreateMsg ("es","el_cuadro_5_bis", "el Niño Rarito, jugando con un orondo ratón; ");
			let msg_cuadro_5 = lib.out ("showMsg", ["el_cuadro_5",{l1: {id: "cuadro_5", txt: "Niño Rarito"}}, {visibleBy: "cuadro1.familiaState.niño"}])
			let msg_cuadro_5_bis = lib.out ("showMsg", ["el_cuadro_5_bis",undefined, {visibleBy: "!cuadro1.familiaState.niño"} ])
			lib.GD_addLink (	{ id: msg_cuadro_5, changeTo: msg_cuadro_5_bis, userCode: {functionId: "setFrame", par: {pnj:"niño"} }, activatedBy: "cuadro1.familiaState.niño" 	} )

			lib.GD_CreateMsg ("es","el_cuadro_6", ", el %l1,");
			lib.GD_CreateMsg ("es","el_cuadro_6_bis", "el Abuelo Rarito, con un murciélago en el hombro;");
			let msg_cuadro_6 = lib.out ("showMsg", ["el_cuadro_6",{l1: {id: "cuadro_6", txt: "Abuelo Rarito"}}, {visibleBy: "cuadro1.familiaState.abuelo"}])
			let msg_cuadro_6_bis = lib.out ("showMsg", ["el_cuadro_6_bis",undefined, {visibleBy: "!cuadro1.familiaState.abuelo"} ])
			lib.GD_addLink (	{ id: msg_cuadro_6, changeTo: msg_cuadro_6_bis, userCode: {functionId: "setFrame", par: {pnj:"abuelo"} }, activatedBy: "cuadro1.familiaState.abuelo" } )

			lib.GD_CreateMsg ("es","el_cuadro_7", "y %l1.<br/>");
			lib.GD_CreateMsg ("es","el_cuadro_7_bis", "y una figura borrada a cuchilladas, que deja entrever a una señora mayor también con un murciélago sobre su hombro. Si existió una Abuela Rarita en la familia es algo que desconocías hasta ahora. ¿Por qué habrán querido destrozar su recuerdo de manera tan cruel?<br/>");
			let msg_cuadro_7 = lib.out ("showMsg", ["el_cuadro_7",{l1: {id: "cuadro_7", txt: "una figura borrada a cuchilladas"}}, {visibleBy: "cuadro1.familiaState.abuela"}])
			let msg_cuadro_7_bis = lib.out ("showMsg", ["el_cuadro_7_bis",undefined, {visibleBy: "!cuadro1.familiaState.abuela"} ])
			lib.GD_addLink (	{ id: msg_cuadro_7, changeTo: msg_cuadro_7_bis, userCode: {functionId: "setFrame", par: {pnj:"abuela"} }, activatedBy: "cuadro1.familiaState.abuela" } )

		}

	});


	items.push ({
		id: 'chimenea',


		desc: function () {

			// to-do: cambiar variables JS por variables de juego con visibleBy
			let jaulaVisto = (lib.exec ("getValue",  {id:"jaula"}) != "0")

			lib.GD_CreateMsg ("es","chimenea_1", "Entre carbón y madera quemada observas los restos de %l1.");
			lib.GD_CreateMsg ("es","chimenea_1_bis", "Entre carbón y madera quemada observas los restos de una jaula chamuscada. ");

			lib.GD_ResetLinks ()

			let msg_chimenea_1 = lib.out ("showMsg", ["chimenea_1",{l1: {id: "chimenea_1", txt: "una jaula chamuscada"}}, !jaulaVisto])
			let msg_chimenea_1_bis = lib.out ("showMsg", ["chimenea_1_bis",undefined, jaulaVisto])
			lib.GD_addLink (	{ id: msg_chimenea_1, changeTo: msg_chimenea_1_bis, visibleToTrue: [msg_jaula_1], libCode: {functionId:'setValue', par: {id:"jaula", value:"1"}} } )

			let huesosVisto = (lib.exec ("getValue",  {id:"huesos"}) != "0")

			lib.GD_CreateMsg ("es","jaula_1", "Dentro puedes ver unos %l1 ")
			lib.GD_CreateMsg ("es","jaula_1_bis", "Dentro puedes ver unos pequeños huesitos, ")
			let msg_jaula_1 = lib.out ("showMsg", ["jaula_1",{l1: {id: "jaula_1", txt: "pequeños huesitos."}}, jaulaVisto & !huesosVisto])
			let msg_jaula_1_bis = lib.out ("showMsg", ["jaula_1_bis",undefined, jaulaVisto & huesosVisto])
			lib.GD_addLink (	{ id: msg_jaula_1, changeTo: msg_jaula_1_bis, visibleToTrue: [msg_huesos_1] , libCode: {functionId:'setValue', par: {id:"huesos", value:"1"}} } )

			lib.GD_CreateMsg ("es","huesos_1", "como de ratón o murciélago. Capaz que estos bárbaros lo han quemado, ya sea para comérselo o a saber para qué innominioso ritual. ¿Cómo vas a poder conseguir el trofeo? Puedes %l1, o bien seguir investigando. Si consigues un trofeo mejor, quizás tus amigos te lo acepten.<br/>");
			lib.GD_CreateMsg ("es","huesos_1_bis", "como de ratón o murciélago. Capaz que estos bárbaros lo han quemado, ya sea para comérselo o a saber para qué innominioso ritual. ¿Cómo vas a poder conseguir el trofeo? Puedes sacarle una foto a la jaula y volverte a casa, o bien seguir investigando. Si consigues un trofeo mejor, quizás tus amigos te lo acepten.");
			let msg_huesos_1 = lib.out ("showMsg", ["huesos_1",{l1: {id: "huesos_1", txt: "sacarle una foto a la jaula y volverte a casa"}}, jaulaVisto & huesosVisto])
			let msg_huesos_1_bis = lib.out ("showMsg", ["huesos_1_bis",undefined, jaulaVisto & !huesosVisto])
			lib.GD_addLink (	{ id: msg_huesos_1, changeTo: msg_huesos_1_bis, action: { choiceId: "action", actionId:"sacar_foto", o1Id: "móvil"} } )

		}

	});

	items.push ({
		id: 'nevera',

		desc: function () {

			let item1 = lib.exec("x",["nevera"])
			if (lib.exec ("getValue", ["nevera"]) == "0") {
				lib.GD_CreateMsg ("es","desc_nevera", "La abres con repuganancia y descubres con sorpresa que está fría. Tiene una lucecita encendida en el interior, a pesar de que el cable que sale de la nevera cuelga, pelado, sin conectar a ningún enchufe.")
				lib.out ("showMsg", ["desc_nevera"])
				lib.exec ("setValue", ["nevera", "1"])

				// que no pasen a estar en la nevera hasta que se describa la primera vez
				lib.exec ("setLoc", ["botella", item1])
				lib.exec ("setLoc", ["taper", item1])
				lib.exec ("setLoc", ["dinamita", item1])
				lib.exec ("setLoc", ["queso", item1])

			} else {
				lib.GD_CreateMsg ("es","desc_nevera_2", "La vuelves a abrir, fascinado por su repugnancia.")
				lib.out ("showMsg", ["desc_nevera_2"])
			}

			let botellaHay = (lib.exec ("getLoc", ["botella"]) == item1)
			let taperHay = (lib.exec ("getLoc", ["taper"]) == item1)
			let dinamitaHay = (lib.exec ("getLoc", ["dinamita"]) == item1)
			let quesoHay = (lib.exec ("getLoc", ["queso"]) == item1)

			let mostrarContenido = (botellaHay || taperHay || dinamitaHay || quesoHay)

			let botellaVisto = (lib.exec ("getValue", ["botella"]) == "1")
			let taperVisto = (lib.exec ("getValue", ["taper"]) != "0")
			let dinamitaVisto = (lib.exec ("getValue", ["dinamita"]) == "1")
			let quesoVisto = (lib.exec ("getValue", ["queso"]) == "1")

			lib.GD_CreateMsg ("es", "dentro_de_nevera", "Dentro de la nevera hay:<br/>");
			lib.out ("showMsg", ["dentro_de_nevera",undefined, mostrarContenido])

			lib.GD_CreateMsg ("es","desc_botella_1", "- %l1<br/>");
			let msg_desc_botella_1 = lib.out ("showMsg", ["desc_botella_1",{l1: {id: "desc_botella_1", txt: "una botella"}} , botellaHay && !botellaVisto])
			lib.GD_CreateMsg ("es","desc_botella_1_bis", "- una botella con un líquido rojo que no parece vino.<br/>");
			let msg_desc_botella_1_bis = lib.out ("showMsg", ["desc_botella_1_bis",undefined , botellaHay && botellaVisto])

			lib.GD_CreateMsg ("es","desc_taper_1", "- %l1<br/>");
			let msg_desc_taper_1 = lib.out ("showMsg", ["desc_taper_1",{l1: {id: "desc_taper_1", txt: "un táper"}} , taperHay && !taperVisto])
			lib.GD_CreateMsg ("es","desc_taper_1_bis", "- un  táper con cosas moviéndose dentro.<br/>");
			let msg_desc_taper_1_bis = lib.out ("showMsg", ["desc_taper_1_bis",undefined , taperHay && taperVisto])

			lib.GD_CreateMsg ("es","desc_dinamita_1", "- %l1<br/>");
			let msg_desc_dinamita_1 = lib.out ("showMsg", ["desc_dinamita_1",{l1: {id: "desc_dinamita_1", txt: "una barra de dinamita"}} , dinamitaHay && !dinamitaVisto])
			lib.GD_CreateMsg ("es","desc_dinamita_1_bis", "- una barra de dinamita, ¿en serio?<br/>");
			let msg_desc_dinamita_1_bis = lib.out ("showMsg", ["desc_dinamita_1_bis",undefined , dinamitaHay && dinamitaVisto])

			lib.GD_CreateMsg ("es","desc_queso_1", "- %l1<br/>");
			let msg_desc_queso_1 = lib.out ("showMsg", ["desc_queso_1",{l1: {id: "desc_queso_1", txt: "queso"}} , quesoHay && !quesoVisto])
			lib.GD_CreateMsg ("es","desc_queso_1_bis", "- queso maloliente<br/>");
			let msg_desc_queso_1_bis = lib.out ("showMsg", ["desc_queso_1_bis",undefined , quesoHay && quesoVisto])

			lib.GD_CreateMsg ("es","desc_nevera_3", "Pero ya no queda nada de su contenido original.<br/>");
			lib.out ("showMsg", ["desc_nevera_3",undefined, !mostrarContenido])

			lib.GD_ResetLinks ()
			lib.GD_addLink (	{ id: msg_desc_botella_1, changeTo: msg_desc_botella_1_bis,
					libCode: {functionId: "setValue", par: {id:"botella", value:"1"}}
				})
			lib.GD_addLink (	{ id: msg_desc_taper_1, changeTo: msg_desc_taper_1_bis,
					libCode: {functionId: "setValue", par: {id:"taper", value:"1"}}
				} )
			lib.GD_addLink (	{ id: msg_desc_dinamita_1, changeTo: msg_desc_dinamita_1_bis,
					libCode: {functionId: "setValue", par: {id:"dinamita", value:"1"}}
				} )
			lib.GD_addLink (	{ id: msg_desc_queso_1, changeTo: msg_desc_queso_1_bis,
					libCode: {functionId: "setValue", par: {id:"queso", value:"1"}}
				} )

		}

	});

	items.push ({
		id: 'espejo',


		desc: function () {
			usr.exec ("escena_espejo")
		}

	});

	items.push ({
		id: 'póster',


		desc: function () {

			let posterVisto = (lib.exec ("getValue", {id:"póster"}) != 0)

			lib.GD_CreateMsg ("es","póster_1", "Ves las ropas y poses típicas de un grupo de rock gótico llamado Los Ultratumba y una estrofa de una cancion del grupo.");
			lib.GD_CreateMsg ("es","póster_2", "La canción reza así:");
			lib.GD_CreateMsg ("es","póster_3", "Dame tu sangre<br/>Si quieres entrar<br/>Dame su sangre<br/>Al mundo infernal.<br/>");

			lib.out ("showMsg", ["póster_1"])
			lib.out ("showMsg", ["póster_2"])
			if (!posterVisto) {lib.out ("PressKey", ["tecla"]);}
			lib.out ("showMsg", ["póster_3"])
			lib.exec ("setValue",  {id:"póster", value:"1"})

		}
	});

	items.push ({
		id: 'gato',

		desc: function () {

			lib.GD_CreateMsg ("es","gato_1", "El gato, ¿o será gata?, parece tener pintada una cresta punky y los ojos maquillados. No te presta la menor atención, ocupado observando el agujero al otro lado de la habitación.");
			lib.out ("showMsg", ["gato_1"])
			lib.exec ("setValue", {id:"gato"}, "1")
		}
	});


		items.push ({
			id: 'ratón',

			desc: function () {

				lib.GD_CreateMsg ("es","ratón_1", "Además de ver su húmedo hocico y sus bigotes moverse entre las sombas, en algún momento se gira y ves por su tamaño que no le falta basura que comer en esta casa.");
				lib.out ("showMsg", ["ratón_1"])
				lib.exec ("setValue", {id:"ratón"}, "1")

			}
		});

		items.push ({
			id: 'cuadro2',

			desc: function () {

				lib.GD_CreateMsg ("es","cuatro2_1", "Es un retato nupcial en el que se observa al Abuelo Rarito de joven, acompañado de su mujer. El cuadro está en perfecto estado, sin una rozadura.");
				lib.out ("showMsg", ["cuatro2_1"])
			}
		});

		items.push ({
			id: 'ataúd',

			desc: function () {

				lib.GD_CreateMsg ("es","ataúd_1", "Te lo quedas mirando largos minutos. Sabes que no puedes salir y que todo te lleva a meterte en esa caja mortuoria de mármol.");
				lib.GD_CreateMsg ("es","ataúd_2", "Entras y tanteas el interior. La tapa tiene unas agarraderas que permiten desplazarla y quedarte encerrado, como así haces.");
				lib.GD_CreateMsg ("es","ataúd_3", "Tierra cayendo sobre tu ataúd, gritos de '¡Monstruo!', ¡ahí te pudras toda la eternidad!<br/>La sangre de la doncella estuvo deliciosa y esos cafres no te clavaron ninguna estaca. Sólo será una siestita de unos años, y volverás a la superficie, en uno de tus saltos temporales al futuro.");
				lib.GD_CreateMsg ("es","ataúd_4", "Ya no estás en el ataúd sino de vuelta en el hall de la mansión.")

				lib.out ("showMsg", ["ataúd_1"])
				lib.GD_CreateMsg ("es","tecla-ataúd-1", "Entra en el ataúd")
				lib.out ("PressKey", ["tecla-ataúd-1"]);
				lib.out ("showMsg", ["ataúd_2"])
				lib.out ("PressKey", ["tecla"]);
				lib.out ("showMsg", ["ataúd_3"])
				lib.GD_CreateMsg ("es","tecla-ataúd-2", "Vuelves al presente")
				lib.out ("PressKey", ["tecla-ataúd-2"]);
				lib.out ("showMsg", ["ataúd_4"])

				lib.exec ("setValue", {id:"ataúd"}, "1")
				lib.exec ("pcSetLoc", ["hall"])

			}
		});

}

function initReactions (lib, usr) {

	// acciones de lib deshabilitadas
	reactions.push ({ id: 'jump', enabled: function (indexItem, indexItem2) {		return false		}	});
	reactions.push ({ id: 'sing', enabled: function (indexItem, indexItem2) {		return false		}	});
	reactions.push ({ id: 'wait', enabled: function (indexItem, indexItem2) {		return false		}	});


	reactions.push ({
		id: 'look',

		enabled: function (indexItem, indexItem2) {
			if (lib.exec ("pc.loc") == lib.exec("x",["intro1"])) { return false }
			if (lib.exec ("pc.loc") == lib.exec("x",["intro2"])) { return false }
		},

		reaction: function (par_c) {

			/*if (par_c.loc == lib.exec("x",["intro1"])) {
				return true // not to redescribe
			}
			*/

		}

	}); // look

	reactions.push ({
		id: 'go',

		reaction: function (par_c) {

			if (par_c.target == lib.exec("x",["intro2"])) {

				lib.GD_CreateMsg ("es", "intro2", "a intro2<br/>");
				lib.out ("showMsg", ["intro2"])
				return false; // just a transition

			}

 			if ((par_c.loc == lib.exec("x",["hall"])) && (par_c.target == lib.exec("x",["porche"])))  {
				lib.GD_CreateMsg ("es", "al porche_1", "Huyes de la casa antes de tiempo, deshonra ante tus amigos<br/>La partida termina, pero seguro que puedes hacerlo mejor la próxima vez.<br/>");
				lib.out ("showMsg", ["al,porche_1"])
				lib.out ("PressKey", ["tecla"]);
				lib.GD_CreateMsg ("es", "al porche_2", "Ahora, entre tú y yo, jugador, hagamos como que nunca has intentado salir, y continua la partida como si nada.<br/>");
				lib.out ("showMsg", ["al,porche_2"])
				//lib.out ("EndGame(", [al porche_1"])
				return true

			}

			if ((par_c.loc == lib.exec("x",["porche"])) && (par_c.target == lib.exec("x",["hall"])))  {

				if (!lib.exec ("isCarried", ["móvil"])) {
					lib.GD_CreateMsg ("es", "entrar_sin_móvil", "El reto consiste en salir con una foto, ¿cómo vas a conseguirla si dejas la cámara fuera?<br/>");
					lib.out ("showMsg", ["entrar_sin_móvil"])
					return true
				}

				//antes de intentar abrir esa majestuosa puerta. Apoyas la mano, seguro de que no abrirá y...
				// ?: "Al tocar el pomo la puerta lanzó un horripilante grito de bienvenida. El intruso dio un salto y casi se dio la vuelta, pero se sobrepuso y acabó de abrir la puerta. Sólo veía un poco alrededor, de la luz de la calle. Al encender la linterna vio que estaba ante un inmenso hall que con su exigua luz no podía apreciar de manera clara, como si en las sombras que quedaban fuera de su haz se movieran figuras amenazantes.<br/>");

				lib.GD_CreateMsg ("es", "ruido_puerta", "Un pequeño empujón y el sonido lastimoso de la puerta al abrirse te suena como la madre del sonido de todas las puertas de las películas de terror de nunca jamás, como si esos presuntuosos ruidos no fueran más que una reproducción de mala calidad de lo que acabas de escuchar.");
				lib.out ("showMsg", ["ruido_puerta"])
				lib.out ("PressKey", ["tecla"]);
				return false

			}

			if ((par_c.loc == lib.exec("x",["pasillo"])) && (par_c.target == lib.exec("x",["hab-hijos"])))  {
				if ( lib.exec ("getLocId", ["ratón"]) == "limbo" ) {
					lib.GD_CreateMsg ("es", "hab_hijos_sellada", "De alguna manera, ya sabes que no hay nada más que hacer en esta habitación.\n")
					lib.out ("showMsg", ["hab_hijos_sellada"])
					return true
				}
			}

			if ((par_c.loc == lib.exec("x",["pasillo"])) && (par_c.target == lib.exec("x",["hab-padres"])))  {
				if (lib.exec ("getValue", {id:"espejo"}) == "1") {
					lib.GD_CreateMsg ("es", "hab_padres_sellada", "Ni por lo más sagrado volverás a entrar en esa habitación y su horrendo espejo.\n")
					lib.out ("showMsg", ["hab_padres_sellada"])
					return true
				}
			}

			if (par_c.loc == lib.exec("x",["hab-padres"]))  {
				if (lib.exec ("getValue", ["espejo"]) == "0") {
					lib.GD_CreateMsg ("es", "mirar_espejo", "Cuando vas a salir, no puedes evitar dejar de observar el espejo.\n")
					lib.out ("showMsg", ["mirar_espejo"])
					usr.exec ("escena_espejo")
					return false
				}
		  }

			if ((par_c.loc == lib.exec("x",["pasillo"])) && (par_c.target == lib.exec("x",["hab-abuelos"])))  {
				if (lib.exec ("getValue", {id:"ataúd"}) == "1") {
					lib.GD_CreateMsg ("es", "entrar_hab_abuelos_ya", "Los que quiera que te dejaron entrar una vez, no parecen querer que sigas merodeando por su casa.<br/>")
					lib.out ("showMsg", ["entrar_hab_abuelos_ya"])
					return true
				} else if ( lib.exec ("getLocId", ["botella-vacía"]) == "limbo" ) {
					lib.GD_CreateMsg ("es", "entrar_hab_abuelos_no", "La puerta no tiene pomo. Está tremendamente fría y es como un mármol negro y oscuro que no refleja la luz. Empujas la puerta, pero eres incapaz de abrirla.<br/>")
					lib.out ("showMsg", ["entrar_hab_abuelos_no"])
					return true
				} else {
					lib.GD_CreateMsg ("es", "entrar_hab_abuelos_sí", "Apoyas tus manos cubiertas de sangre en la fría puerta de mármol negro y notas cómo se abre sin hacer ningún ruido. Al entrar descubres que se cierra detrás tuya con igual discreción.<br/>")
					lib.out ("showMsg", ["entrar_hab_abuelos_sí"])
					return false
				}
			}

			if ((par_c.loc == lib.exec("x",["hab-abuelos"])))  {
				lib.GD_CreateMsg ("es", "salir_hab_abuelos_no", "No encuentras la manera de abrir la fría puerta de mármol.<br/>")
				lib.out ("showMsg", ["salir_hab_abuelos_no"])
				return true
			}

		}

	}); // go

	reactions.push ({
		id: 'goto',

		reaction: function (par_c) {

			if ((par_c.loc == lib.exec("x",["intro2"])) && (par_c.item1Id == "porche"))  {
				lib.GD_CreateMsg ("es", "de_intro_a_porche", "Trastabillas y te caes, te arañas con los arbustos, y casi pierdes el móvil, pero llegas hasta el porche y recuperas el aliento.<br/>");
				lib.out ("showMsg", ["de_intro_a_porche"])
				lib.GD_CreateMsg ("es","mira","mira")
				lib.out ("PressKey", ["mira"]);
				return false // go to the location and show description
			}

		}

	}); // go-to

	reactions.push ({

		id: 'sacar_foto',

		enabled: function (indexItem, indexItem2) {

			if (indexItem != lib.exec("x",["móvil"])) return false;
			return true;
		},

		reaction: function (par_c) {
			// si en hall y ya has visto los huesos => significa que te vas a tu casa
			if ((par_c.loc == lib.exec("x",["hall"])) && (lib.exec ("getValue", {id:"huesos"}) == "1") )  {
				lib.exec ("setValue", {id:"huesos", value:"2"})
				lib.GD_CreateMsg ("es", "te_vas_si_pero_no_1", "Sacas las fotos a esos míseros huesos y te diriges a la puerta.<br/>");
				lib.GD_CreateMsg ("es", "te_vas_si_pero_no_2", "Pero cuando vas a girar el pomo de la puerta oyes las risas de desprecio de tus amigos y con rabia das la vuelta. ¡Los vas a dejar muditos!<br/>");

				lib.out ("showMsg", ["te_vas_si_pero_no_1"]);
				lib.out ("PressKey", ["tecla"]);
				lib.out ("showMsg", ["te_vas_si_pero_no_2"]);

				return true;
			}

			if ((par_c.loc == lib.exec("x",["cocina"])) && ( lib.exec ("getLocId", ["botella"]) == "limbo") && (lib.exec ("getValue", {id:"botella"}) != "2"))  {
				lib.exec ("setValue", {id:"botella", value:"2"})
				lib.GD_CreateMsg ("es", "selfie_de_sangre", "Te sacas un selfie, pero cuando ves a esa cara demacrada cuberta de sangre, lo borras para no dejar rastro de tu vergüenza.<br/>");

				lib.out ("showMsg", ["selfie_de_sangre"]);

				return true;

			}


			lib.GD_CreateMsg ("es", "sacas_foto", "Sacas una foto sin ton ni son.<br/>");
			lib.out ("showMsg", ["sacas_foto"]);


			return true;
		}


	});

	reactions.push ({

		id: 'drop',

		reaction: function (par_c) {

			if (par_c.item1Id == "móvil") {
				lib.GD_CreateMsg ("es","dejar_móvil", "Aunque ilumina poco, sin él no verías casi nada en la casa. Además, ¿cómo sacarás la foto que necesitas sin él? Lo dejas estar.<br/>")
				lib.out ("showMsg", ["dejar_móvil"])
				return true
			}

		if (par_c.item1Id == "queso") {
			if (lib.exec ("pc.loc") == lib.exec ("x", ["hab-hijos"])) {
				// escena pelea ratón y gato
				lib.GD_CreateMsg ("es","dar_queso_1", "Al dejarle en el suelo el queso al ratón, el ratón sale tímidamente de su agujero, y el gato se abalanza sobre él.")
				lib.GD_CreateMsg ("es","dar_queso_2", "El gato le propina un par de zarpazos, pero el ratón lo mira con unos llameantes ojos rojos que hacen arder la cola del gato, por lo que sale corriendo de la habitación mientras el ratón se va con el queso a su agujero, triunfante esta vez.<br/>")

				lib.out ("showMsg", ["dar_queso_1"])
				lib.out ("PressKey", ["tecla"]);
				lib.out ("showMsg", ["dar_queso_2"])

				lib.exec ("setLoc", ["queso", "limbo"])
				lib.exec ("setLoc", ["ratón", "limbo"])
				lib.exec ("setLoc", ["gato", "limbo"])

				lib.exec ("setValue", {id:"ratón", value:"1"})
				lib.exec ("setValue", {id:"gato", value:"1"})
				return true
			}
		}
		return false
	}

	});

	reactions.push ({

		id: 'listen',

		enabled: function (indexItem, indexItem2) {

			if (indexItem != lib.exec("x",["chimenea"])) return false;
			return true;
		},


		reaction: function (par_c) {

			let escena = usr.exec ("escenas_pendientes")
			lib.GD_CreateMsg ("es","escuchas_1", "Una voz lejana y amable te susurra:<br/>")
			lib.out ("showMsg", ["escuchas_1"])
			lib.out ("ShowMsgAsIs", [escena])

			if (escena == "done") {
				usr.exec ("escenaFinal")
			}

			return true
		}

	});

	reactions.push ({

		id: 'take_from',

		reaction: function (par_c) {
			// si es la dinamita, escena de la guerra
			if ((par_c.item1Id == "dinamita") || (par_c.item1Id == "botella")) {
				if (par_c.item1Id == "dinamita") {
					lib.GD_CreateMsg ("es","coger_dinamita", "Al coger la dinamita todo se vuelve oscuro.")
					lib.out ("showMsg", ["coger_dinamita"])
				} else {
					lib.GD_CreateMsg ("es","coger_botella", "Nunca has bebido alcohol en tu vida, pero esta casa te está dando tanto miedo que crees que echarte un trago te hará sacudírtelo de encima. Pero nada más abrirlo te das cuenta de que eso no es vino, sino... los efluvios que salen de la botella te transportan a otro mundo.")
					lib.out ("showMsg", ["coger_botella"])
				}
				lib.out ("PressKey", ["tecla"]);

				lib.GD_CreateMsg ("es","coger_dinamita_11", "Estás en mitad de un combate de principios de siglo 20, en las trincheras. Un enemigo a caballo salta hacia ti. Coges la dinamita, se la arrojas. Caballo y jinete saltan por los aires en pedazos, y sobre ti caen jirones de carne y mucha sangre.<br/>")
				lib.GD_CreateMsg ("es","coger_dinamita_12", "Te estás muriendo desangrado, pero llega una especie de ratón volador, un murciélago que se posa en tu pecho y te mira con mirada inquisidora.<br/>")
				lib.GD_CreateMsg ("es","coger_dinamita_13", "Sin saber muy bien por qué, con tu último álito vital, asientas, ladeas la cabeza y dejas que el bicho te muerda en el cuello.<br/>")
				lib.out ("showMsg", ["coger_dinamita_11"])
				lib.out ("showMsg", ["coger_dinamita_12"])
				lib.out ("showMsg", ["coger_dinamita_13"])
				lib.out ("PressKey", ["tecla"]);

				lib.GD_CreateMsg ("es","coger_dinamita_21", 	"Al recuperar la consciencia, ya no tienes la dinamita en la mano, pero sí la botella, ahora vacía, de la nevera. Estás cubierto de sangre de cabeza a los pie , rodeado de un charco alrededor.<br/>");
				lib.GD_CreateMsg ("es","coger_dinamita_22", 	"Al volver en sí, te tocas el cuello, pero no tienes nada.<br/>");
				lib.out ("showMsg", ["coger_dinamita_21"])
				lib.out ("showMsg", ["coger_dinamita_22"])

				lib.GD_CreateMsg ("es","coger_dinamita_3", "¿No has tenido suficiente? %l1<br/>");
				let msg_coger_dinamita_3 = lib.out ("showMsg", ["coger_dinamita_3",{l1: {id: "coger_dinamita_3", txt: "¡Sácate un selfie y sale de esta casa diabólica por dios!"}} ])
				//  (selfie -> la foto saldrá sin sangre)


				lib.GD_ResetLinks ()
				lib.GD_addLink (	{ id:msg_coger_dinamita_3, action: { choiceId: "action", actionId:"sacar_foto", o1Id: "móvil"}} )

				lib.exec ("setLoc", ["dinamita", "limbo"])
				lib.exec ("setLoc", ["botella", "limbo"])
				lib.exec ("setLoc", ["botella-vacía", lib.exec("pc.loc")])

				return true;
			}

			if (par_c.item1Id == "taper") {
				lib.GD_CreateMsg ("es","coger_taper_1", "Al coger el táper lo miras con atención. Notas el movimiento en su interior, pero no puedes evitar abrirlo. Ves que lo que se mueve son gusanos, alimentándose de un pútrido trozo de carne. A pesar del asco, sientes fascinación hipnótica por toda esa maraña en movimiento y te descubres sin creértelo cogiendo un puñado y metiéndotelo en la boca.<br/>")
				lib.GD_CreateMsg ("es","coger_taper_2", "Se estable una especie de diálogo entre esas hediondas criaturas y tú, que termina con el masticado de las mismas seguida de una visión en primera persona de la siguiente escena imposible:<br/>")
				lib.GD_CreateMsg ("es","coger_taper_3", "Noche de brujas. Hoguera y luna llena. Estás encerrada (eres mujer) en una jaula transportada por personas de ambos sexo desnudas y con máscaras de animales. Gritas a medida que se acercan al fuego. Cada vez más calor. Dolor. Depositan la jaula dentro del fuego. Dolor imposible.<br/>")
				lib.GD_CreateMsg ("es","coger_taper_4", "Sales del trance. El táper está en el suelo, rodeado del vómito que has debido de haber tenido, con algunos gusanos merodeando aún por ahí, pero estás tan avergonzado de lo que acaba de pasar que anulas el táper de tu visión, como si no existiera.<br/>")

				lib.out ("showMsg", ["coger_taper_1"])
				lib.out ("PressKey", ["tecla"]);
				lib.out ("showMsg", ["coger_taper_2"])
				lib.out ("PressKey", ["tecla"]);
				lib.out ("showMsg", ["coger_taper_3"])
				lib.out ("PressKey", ["tecla"]);
				lib.out ("showMsg", ["coger_taper_4"])
				lib.out ("PressKey", ["tecla"]);

				lib.exec ("setLoc", ["taper", "limbo"])
				lib.exec ("setValue", {id:"taper", value:"2"})
				return true;
			}

			if (par_c.item1Id == "queso") {

				if (lib.exec ("getValue", {id:"ratón"}) == "0") {
					lib.GD_CreateMsg ("es","coger_queso_no", "Más de cerca, ves que el queso maloliente está cubierto de una capa grasienta de moho multicolor, lo tocas pero te da tanto asco que no lo coges.<br/>")
					lib.out ("showMsg", ["coger_queso_no"])
					return true
				} else {
					lib.GD_CreateMsg ("es","coger_queso_sí", "Es asqueroso, pero quizás... en la habitación de la litera...<br/>")
					lib.out ("showMsg", ["coger_queso_sí"])
					return false

				}

			}


			return false

		}


	});


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

	userFunctions.push ({
		id: 'escena_espejo',
		code: function (par) {
			lib.GD_CreateMsg ("es","desc_espejo_1", "Lo observas absorto... las sombras en la cama parecen cobrar forma, una forma se mueve como, no!, es una serpiente de dos metros de manchas rojas y verdes, que se enrosca alrededor tuyo.")
			lib.GD_CreateMsg ("es","desc_espejo_2", "Oyes un aullido al otro lado de la puerta, que se abre de golpe. La figura imponente de un lobo salta a la cama y te arroja fuera de ella con un zarpazo. La pelea de pasión y sexo que ves desplegarse delante tuya entre dos seres de naturaleza tan dispar, de seguro dejarán huella en tu psique el resto de tu vida. No lo pudes soportar y gritas, pierdes el aliento y caes al suelo.")
			lib.GD_CreateMsg ("es","desc_espejo_post_1", "Al despertar descubres que estás fuera de la habitación, que está ahora cerrada con llave.")

			lib.out ("showMsg", ["desc_espejo_1"])
			lib.out ("PressKey", ["tecla"]);
			lib.out ("showMsg", ["desc_espejo_2"])
			lib.out ("PressKey", ["tecla"]);
			lib.out ("showMsg", ["desc_espejo_post_1"])
			lib.out ("PressKey", ["tecla"]);

			lib.exec ("setValue", {id:"espejo", value:"1"})
			lib.out ("PressKey", ["tecla"]);
			lib.exec ("pcSetLoc", ["pasillo"])
		}

	});

	userFunctions.push ({
		id: 'escenas_pendientes',
		code: function (par) {
			let suma = 0
			let escenas = ["sangre", "hambre", "espejo", "ataúd", "cuadro", "huesos", "gusanos"]
			let estado_escena = [false,false,false,false,false,false,false]

			//let lib = lib // tricky

			estado_escena[0] = (lib.exec ("getLocId", ["botella-vacía"]) == "limbo")
			estado_escena[1] = (lib.exec ("getLocId", ["ratón"]) != "limbo")
			estado_escena[2] = (lib.exec ("getValue", {id:"espejo"}) == "0")
			estado_escena[3] = (lib.exec ("getValue", {id:"ataúd"}) == "0")
			estado_escena[4] = (lib.exec ("getValue", {id:"cuadro1"}) == "0")
			estado_escena[5] = (lib.exec ("getValue", {id:"huesos"}) == "0")
			estado_escena[6] = (lib.exec ("getValue", {id:"taper"}) != "2")

			let pendientes = 0
			for (let i=0; i<estado_escena.length;i++) if (estado_escena[i]) pendientes++

			console.log("Debug: quedan " + pendientes + " cosas por hacer: " + JSON.stringify (pendientes))

			let elegido = lib.MISC_Random(pendientes)

			for (let i=0, j=0; i<estado_escena.length;i++) {
				if (estado_escena[i]) {
					if (j==elegido) {
						return escenas[i]
					}
					j++;
				}
			}

			return "done"
		}

	});

	userFunctions.push ({
		id: 'escenaFinal',
		code: function (par) {

			lib.GD_CreateMsg ("es","escena_final_1", "Suena el móvil! Los Raritos, ya están de vuelta! No sabes ni donde esconderte y acabas en el hall, debajo de una mesa, justo a tiempo cuando oyes abrir la puerta se abre en silencio dejando pasar las risas de la famila. Un click y la luz se enciende.<br/>")
		  lib.GD_CreateMsg ("es","escena_final_2", "Todo es brillo y pulcritud.")
			lib.GD_CreateMsg ("es","escena_final_3", "El niño sin dejar de comer golosinas sin parar, se te acerca, te lanza un ingenuo bú! y se va entre risas mientras le intenta poner la zancadilla a su hermana, que lo esquiva sin mayor esfuerzo y subes las escaleras a su habitación mientras escucha música de sus casos y sin prestarte la más mínima atención.")
			lib.GD_CreateMsg ("es","escena_final_4", "Los padres te ofrecen la mano y te hacen salir de tu escondite.<br/>")
			lib.GD_CreateMsg ("es","escena_final_5", "El: Parece que has tenido un memorable Halloween! Auuuuuuuuuuuu!<br/>")
			lib.GD_CreateMsg ("es","escena_final_6", "Ella: No te dejezzzzzzz confundir, nada ezzzzzzz lo que parece zer.<br/>")
			lib.GD_CreateMsg ("es","escena_final_7", "El abuelo se acerca a ti y sale contigo al porche, rodeados de plantas hermosas y sanas, echándote un amigable brazo al hombro.<br/>")
			lib.GD_CreateMsg ("es","escena_abuelo_1", "Abuelo: Creo que después de esta noche no volverás a entrar en casas ajenas sin persono, ¿verdad?<br/>")
			lib.GD_CreateMsg ("es","escena_abuelo_2", "Asientes")
			lib.GD_CreateMsg ("es","escena_abuelo_3", "Abuelo: Tengo esto para ti, pero no lo abras todavía.<br/>" )
			lib.GD_CreateMsg ("es","escena_abuelo_4", "Te entrega un sobre y te coge el móvil.")
			lib.GD_CreateMsg ("es","escena_abuelo_5", "Abuelo: Está claro que este momento hay que retratarlo!<br/>")
			lib.GD_CreateMsg ("es","escena_abuelo_6", "Se saca un selfie contigo y entra en la casa, dejándote a solas en el mismo porche de hojas muertas al que saltaste hace ahora un rato.<br/>")
			lib.GD_CreateMsg ("es","escena_abuelo_7", "Un sobre y una foto. Truco y trato, lo tienes todo esta noche. Te sientas en el bordillo del porche y los observas con detenimiento:<br/>")

			lib.GD_CreateMsg ("es","sobre", "No puede ser! Dentro está la carta que te salió mientras jugabas con tus amigos, ¿pero qué diablos...?, ¿cómo es que...?<br/>")
			lib.GD_CreateMsg ("es","foto", "Tus desvelos no podían quedar en saco roto: en la foto que sacó el Abuelo sales tú sonriendo, con un murciélago apoyado en tu hombro.<br/>")

			lib.GD_CreateMsg ("es","caray", "Caray, qué noche. Sales de la finca de Los Raritos, caminando entre zombies y brujas.")

			lib.out ("showMsg", ["escena_final_1"])
			lib.out ("PressKey", ["tecla"]);
			lib.out ("showMsg", ["escena_final_2"])
			lib.out ("showMsg", ["escena_final_3"])
			lib.out ("showMsg", ["escena_final_4"])
			lib.out ("PressKey", ["tecla"]);
			lib.out ("showMsg", ["escena_final_5"])
			lib.out ("showMsg", ["escena_final_6"])

			lib.out ("PressKey", ["tecla"]);

			lib.out ("showMsg", ["escena_final_7"])

			lib.out ("PressKey", ["tecla"]);

			lib.out ("showMsg", ["escena_abuelo_1"])
			lib.out ("showMsg", ["escena_abuelo_2"])
			lib.out ("PressKey", ["tecla"]);
			lib.out ("showMsg", ["escena_abuelo_3"])
			lib.out ("showMsg", ["escena_abuelo_4"])
			lib.out ("PressKey", ["tecla"]);
			lib.out ("showMsg", ["escena_abuelo_5"])
			lib.out ("showMsg", ["escena_abuelo_6"])
			lib.out ("showMsg", ["escena_abuelo_7"])

		  // to-do: interactivo
			lib.GD_CreateMsg ("es","tecla-sobre", "Ver el contenido del sobre")
			lib.out ("PressKey", ["tecla-sobre"]);
			lib.out ("showMsg", ["sobre"])
			lib.GD_CreateMsg ("es","tecla-foto", "Ver el selfie con el Abuelo Rarito")
			lib.out ("PressKey", ["tecla-foto"]);
			lib.out ("showMsg", ["foto"])

			lib.GD_CreateMsg ("es","tecla-caray", "Sales a la calle")
			lib.out ("PressKey", ["tecla-caray"]);

		  lib.out ("EndGame", ["caray"])
			lib.exec ("setValue", {id:"intro2", value:"1"})
		}

	});

}
