let usrX = {
	items: [],
	reactions: [],
	attributes: [],

	turn: function (indexItem) {

		var  primitives = this.primitives // tricky

		if (indexItem != primitives.IT_X("hall")) return
		if (usr.getValue({id:"intro2"}) == "1") return

		if (usr.escenas_pendientes() != "done") return

		usr.escenaFinal()

	},


	initItems:  function  (items, primitives) {

	/*
		items.push ({
			id: 'móvil',

			desc: function () {
				primitives.CA_ShowMsg ("móvil")

			}

		});
	*/

	items.push ({
		id: 'intro1',

		desc: function () {

			primitives.CA_EnableChoices(false)

			primitives.GD_CreateMsg ("es","tecla","avanza")

			primitives.GD_CreateMsg ("es","Intro0", "Bienvenido al juego Intruso, participante en la %l1.<br/>Correcciones hechas a fecha de 17 de noviembre, disculpen los bugs previos y gracias por los comentarios!<br/>");
			primitives.GD_CreateMsg ("es","Intro1", "Antes de comenzar el juego, hay algunas %l1 que deberías conocer previamente.<br/>");
			primitives.GD_CreateMsg ("es","Intro2", "Pero si ya las conoces, puedes empezar a %l1 directamente.<br/>");
			primitives.GD_CreateMsg ("es","Intro3", "Disfruta de la partida.<br/>");
			primitives.GD_CreateMsg ("es", "Consideración0", "Si ya has jugado anteriormente a juegos desarrollados con el motor de kunludi ya sabrás que la interacción se realiza con las opciones disponibles después del texto de la última reacción. Cuando la acción no es directa, primero tienes que seleccionar el objeto sobre el que quieres actuar y luego la acción a desarrollar.%l1<br/>");
			primitives.GD_CreateMsg ("es", "Consideración1", "En esta versión del motor, se han incorporado enlaces en los textos, simulando un poco el estilo Twine/Inkle. %l1<br/>");
			primitives.GD_CreateMsg ("es", "Consideración2", "También se ha incorporado un filtro para los los ítems y acciones disponibles. Si pulsas 'enter' mientras editas el filtro, se ejecutará la primera de las opciones disponibles. Es una forma muy dinámica de interacturar (al menos por web) y te animamos a usarla.%l1<br/>");

			var intro0 = primitives.CA_ShowMsg ("Intro0", {l1: {id: "intro0", txt: "ectocomp 2021"}});
			var intro1 = primitives.CA_ShowMsg ("Intro1", {l1: {id: "intro1", txt: "consideraciones de jugabilidad"}});
			var intro2 = primitives.CA_ShowMsg ("Intro2", {l1: {id: "intro2", txt: "jugar"}});
			var intro3 = primitives.CA_ShowMsg ("Intro3", undefined, false);
			var consi0 = primitives.CA_ShowMsg ("Consideración0", {l1: {id: "consi0", txt: "sigue leyendo"}}, false)
			var consi1 = primitives.CA_ShowMsg ("Consideración1", {l1: {id: "consi1", txt: "sigue leyendo"}}, false)
			var consi2 = primitives.CA_ShowMsg ("Consideración2", {l1: {id: "consi2", txt: "El juego comienza"}}, false)

			primitives.GD_DefAllLinks ([
				{ id:intro0, url: "https://itch.io/jam/ectocomp-2021-espanol"},
				{ id:intro1, visibleToFalse: [intro2], changeTo: consi0},
				{ id:intro2, visibleToFalse: [intro1], changeTo: intro3,
					action: { choiceId: "action", actionId:"goto", o1Id: "intro2"}
					//userCode: {functionId: "goto", par: {target:"intro2"} }
				},
				{ id:consi0, changeTo: consi1},
				{ id:consi1, changeTo: consi2},
				{ id:consi2, changeTo: intro3, 	action: { choiceId: "action", actionId:"goto", o1Id: "intro2"}}
			])



		}

	});

	items.push ({
		id: 'intro2',

		desc: function () {


			primitives.GD_CreateMsg ("es", "escena_inicial_1", "Es sólo entrar y salir. Localizar el dichoso trofeo, sacarle una foto y salir pitando.<br/>");
			primitives.GD_CreateMsg ("es", "escena_inicial_2", "Sabes que la familia Rarita va a salir a celebrar la noche de Halloween fuera de casa. Escondido detrás de un arbusto en su ruinoso jardín, los acabas de ver desfilar delante tuyo, con unas pintas que por una vez al año no desentona con la del resto.<br/>")
			primitives.GD_CreateMsg ("es", "escena_inicial_3", "¿Cómo has podido dejarte enredar en esto?<br/>");

			primitives.CA_ShowMsg ("escena_inicial_1")
			primitives.CA_ShowMsg ("escena_inicial_2")
			primitives.CA_ShowMsg ("escena_inicial_3")

			primitives.CA_PressKey ("tecla");

			primitives.GD_CreateMsg ("es", "flashback_1", "Flashback. Ayer noche. Reunión semanal de colegas de rol-o-lo-que-surja<br/>");
			primitives.GD_CreateMsg ("es", "flashback_21", "Bela: Venga, tira tu carta ya, ¡que nos aburrimos! No seas gallina, no creo que te vaya a salir 'desafío'.<br/>")
			primitives.GD_CreateMsg ("es", "flashback_22", "Lanzas las cartas y...<br/>")
			primitives.GD_CreateMsg ("es", "flashback_23", "Tú: ¿¡Qué...!? La muy de Bela, gafe no, gafona, pájaro de mal agüero.<br/>")
			primitives.GD_CreateMsg ("es", "flashback_24", "Todos (voces solapadas): ¡No jodas! ¡Bien! ¡Ya era hora de que te tocara! ¡Somos ricos!<br/>")
			primitives.GD_CreateMsg ("es", "flashback_25", "Tú: Un momento. aún tengo una oportunidad.<br/>")
			primitives.GD_CreateMsg ("es", "flashback_26", "Truda: Tú sueñas. Vamos equipo, a deliberar. Tú, por favor, sale de la habitación un momento.<br/>")
			primitives.GD_CreateMsg ("es", "flashback_31", "Por mucho que pegaste el oído a la puerta sólo oíste sus risas. Luego, cuando volviste a entrar:<br/>")
			primitives.GD_CreateMsg ("es", "flashback_32", "Fiulo: Hemos decidido que si quieres retener tu mazo de cartas deberás superar este reto:<br/>")
			primitives.GD_CreateMsg ("es", "flashback_4", "Tienes que entrar en la casa de Los Raritos y salir con una foto de la mascota del menor de La Familia Rarita.<br/>")
			primitives.GD_CreateMsg ("es", "flashback_5", "Sales de tu ensimismamiento.<br/>");
			primitives.GD_CreateMsg ("es", "flashback_6", "Ahora que acaban de subirse a su coche fúnebre de cristales oscuros, sabes que ha llegado el momento de entrar. Tu corazón late a mil por hora, los músculos se tensan, así que...<br/>")

			primitives.CA_ShowMsg ("flashback_1")
	  	primitives.CA_PressKey ("tecla");
			primitives.CA_ShowMsg ("flashback_21")
			primitives.CA_ShowMsg ("flashback_22")
			primitives.CA_ShowMsg ("flashback_23")
			primitives.CA_ShowMsg ("flashback_24")
			primitives.CA_ShowMsg ("flashback_25")
			primitives.CA_ShowMsg ("flashback_26")
			primitives.CA_PressKey ("tecla");
			primitives.CA_ShowMsg ("flashback_31")
			primitives.CA_ShowMsg ("flashback_32")
			primitives.CA_PressKey ("tecla");
			primitives.CA_ShowMsg ("flashback_4")
			primitives.CA_PressKey ("tecla");
			primitives.CA_ShowMsg ("flashback_5")
			primitives.CA_PressKey ("tecla");
			primitives.CA_ShowMsg ("flashback_6")

			primitives.GD_CreateMsg ("es", "corre", "¡%l1!<br/>")
			var msg_corre = primitives.CA_ShowMsg ("corre", {l1: {id: "corre", txt: "CORRE"}})

			primitives.GD_DefAllLinks ([
				{ id: msg_corre, 	action: { choiceId: "action", actionId:"goto", o1Id: "porche"}}
			])

			/*
			primitives.GD_CreateMsg ("es", "DLG_test", "test")
			primitives.CA_QuoteBegin ("Nadie", "DLG_test" , undefined, true ); // error: [    ]
			primitives.CA_ShowMsg ("<br/>")
			*/

		}

	});

	items.push ({
		id: 'porche',

		desc: function () {

			primitives.GD_CreateMsg ("es","desc-porche-1", "Las telarañas del sofá colgante son frondosas, pero no decorativas precisamente. Si aquí en el exterior está todo tan mugriento, no quieras ni imaginarte cómo estarán las cosas %l1.<br/>");
			let dentro = primitives.CA_ShowMsg ("desc-porche-1", {l1: {id: "dentro", txt: "dentro"}})

			if (primitives.IT_GetAttPropValue (primitives.IT_X(this.id), "generalState", "state") == "0") {  // primera vez
				primitives.GD_CreateMsg ("es","desc-porche-2", "Sólo estás armado con el %l1 vintage que te dejaron tus amigos.<br/>");

				let msg_movil = primitives.CA_ShowMsg ("desc-porche-2", {l1: {id: "móvil", txt: "móvil"}})
				primitives.GD_DefAllLinks ([
					{ id:dentro, action: { choiceId: "dir1", actionId:"go", d1Id:"in", target: primitives.IT_X("hall"), targetId: "hall", d1Id:"in", d1: primitives.DIR_GetIndex("in")}},
				  { id:msg_movil, action: { choiceId: "obj1", o1Id: "móvil"}}
				])

				primitives.GD_CreateMsg ("es","desc-porche-3", "Por el rabillo del ojo vez algo deslizarse. Al enfocar  la vista ves un surco sobre el descuidado césped que va desde donde viste el movimiento hasta un agujero debajo de una de las paredes externas de la casa.<br/>");
				primitives.CA_ShowMsg ("desc-porche-3")

				primitives.IT_SetLoc(primitives.IT_X("móvil"), primitives.PC_X());
				primitives.IT_SetAttPropValue (primitives.IT_X(this.id), "generalState", "state", "1")

				primitives.CA_EnableChoices(true)
			} else {
				primitives.GD_DefAllLinks ([
				  { id:dentro, action: { choiceId: "dir1", actionId:"go", d1Id:"in", target: primitives.IT_X("hall"), targetId: "hall", d1Id:"in", d1: primitives.DIR_GetIndex("in")}}
				])
			}

		}

	});



		items.push ({
			id: 'hall',

			desc: function () {

				// debug: sólo por si en pruebas empezamos aquí.
				primitives.GD_CreateMsg ("es","tecla","avanza")
				primitives.IT_SetLoc(primitives.IT_X("móvil"), primitives.PC_X());

				primitives.GD_CreateMsg ("es","desc_hall_0", "Dejas detrás de ti la puerta exterior. Sabes que salir representa resignarte a la burla de tus amigos y perder tu fabuloso mazo de cartas.<br/>");
				primitives.CA_ShowMsg ("desc_hall_0");

				var huesosVisto = (usr.getValue({id:"huesos"}) != "0")
				primitives.GD_CreateMsg ("es","desc_hall_1", "Una inmensa %l1 domina uno de los laterales del salón. ");
				primitives.GD_CreateMsg ("es","desc_hall_a_cocina", "Por el otro lateral, atravesando el comedor, entrevés una puerta que seguramente %l1.<br/>");

				primitives.GD_CreateMsg ("es","desc_hall_2", "A través de un magnífica escalera con tapete, que sería rojo si no fuera por las marcas de %l1, ");
				primitives.GD_CreateMsg ("es","desc_hall_2_plus", " no sólo de personas sino también de animales de distintos tamaños y que no identificas, ");
				primitives.GD_CreateMsg ("es","desc_hall_3", " podrías %l1.");

				var desc_hall_1 = primitives.CA_ShowMsg ("desc_hall_1", {l1:{id: "desc_hall_1", txt: "chimenea"}}, !huesosVisto)
				var desc_hall_a_cocina = primitives.CA_ShowMsg ("desc_hall_a_cocina", {l1:{id: "desc_hall_a_cocina", txt: "lleva a la cocina"}})
				var desc_hall_2 = primitives.CA_ShowMsg ("desc_hall_2", {l1:{id: "desc_hall_2", txt: "pisadas"}})
				var desc_hall_2_plus = primitives.CA_ShowMsg ("desc_hall_2_plus", undefined, false)
				var desc_hall_3 = primitives.CA_ShowMsg ("desc_hall_3", {l1:{id: "desc_hall_3", txt: "ir a la planta alta"}})


				primitives.GD_CreateMsg ("es","interruptores_1", "Está todo bastante oscuro pero ves %l1 ");
				primitives.GD_CreateMsg ("es","interruptores_2", "que están cubiertos de mugre pegajosa y no funcionan.<br/>");

				var interruptoresVisto = (usr.getValue({id:"interruptores"}) != "0")
				var msg_interruptores_1 = primitives.CA_ShowMsg ("interruptores_1", {l1:{id: "interruptores_1", txt: "algunos interruptores"}})
				var msg_interruptores_2 = primitives.CA_ShowMsg ("interruptores_2", undefined, interruptoresVisto)

				primitives.GD_DefAllLinks ([
					{ id: desc_hall_1, action: { choiceId: "action", actionId:"ex", o1Id: "chimenea"} } ,
					{ id: desc_hall_a_cocina, action: { choiceId: "dir1", actionId:"go", target: primitives.IT_X("cocina"), targetId: "cocina", d1Id:"d270", d1: primitives.DIR_GetIndex("d270")}},
					{ id: desc_hall_2, visibleToTrue: [desc_hall_2_plus]},
					{ id: msg_interruptores_1, visibleToTrue: [msg_interruptores_2], activatedBy: "interruptores" },
					{id: desc_hall_3, action: { choiceId: "dir1", actionId:"go", target: primitives.IT_X("pasillo"), targetId: "pasillo", d1Id:"up", d1: primitives.DIR_GetIndex("up")}}
				])

				// escena final (final feliz)
				primitives.GD_CreateMsg ("es","escena-final-1", "Estás rodeado del lobo, el murciélago, el ratón, el gato y sólo falta la serpiente para completar el zoo Rarito.<br/>");
				primitives.GD_CreateMsg ("es","escena-final-2", "En ese momento, suena el teléfono: ¡Los Raritos están llegando, corre!<br/>");
				primitives.GD_CreateMsg ("es","escena-final-3", "Al ir a la puerta, aparece la serpiente que se levanta y te corta el camino.<br/>");
				primitives.GD_CreateMsg ("es","escena-final-4", "Estás atrapado! Cierras los ojos, te haces un ovillo en el suelo y te lo haces encima.<br/>");
				//<tecla>
				primitives.GD_CreateMsg ("es","escena-final-5", "Al poco, oyes como un grupo de personas se aproxima cantando y haciéndo bromas de Hallowen. Entonces se abre la puerta, casi de manera imperceptible, y oyes el clic de un interruptor. Se enciende una luz respandeciente, que se cuela entre tus dedos.<br/>");
				primitives.GD_CreateMsg ("es","escena-final-6", "Levantas la cabeza, te tapas torpemente la entrepierna del pantalón mojada de orín y los ves. La Familia Rarita al completo, que te observa con atención.<br/>");
				primitives.GD_CreateMsg ("es","escena-final-7", "Niño Rarito deja su calabaza llena de chuches y saca un móvil.<br/>");
				//<tecla>
				primitives.GD_CreateMsg ("es","escena-final-8", "Flash! Te acaba de sacar una foto?<br/>");
				primitives.GD_CreateMsg ("es","escena-final-9", "La adolescente Rarita sube las escaleras escuchando la música de sus cascos y mirando su móvil, sin prestarte atención.<br/>");
				primitives.GD_CreateMsg ("es","escena-final-10", "El abuelo te sonríe y te hace un gesto para que lo acompañes al exterior.<br/>");
				// <tecla>
				primitives.GD_CreateMsg ("es","escena-final-11", "abuelo:<br/>");
				primitives.GD_CreateMsg ("es","escena-final-12", "Hijo mío, espero que esta noche hayas aprendido la lección de que no se debe entras en casas ajenas.<br/>");
				primitives.GD_CreateMsg ("es","escena-final-13", "Como recuerdo, llévate esta foto de recuerdo -> al verla con tus amigos, sales con un murciélago en tu hombro. Has conseguido el reto y no sólo conservas tu mazo de cartas sino el respeto y devoción de tus amigos.<br/>");
				//primitives.CA_EndGame("escena-final-13")

			}

		});

		items.push ({
			id: 'cocina',

			desc: function () {


				primitives.GD_CreateMsg ("es","desc_cocina", "Es la cocina más nauseabunda que has visto en tu vida. Te da asco tocar nada, pero una curiosidad malsana te tienta a %l1.")
				var desc_cocina =  primitives.CA_ShowMsg ("desc_cocina", {l1:{id: "desc_cocina", txt: "mirar qué habrá dentro de la nevera"}})

				primitives.GD_DefAllLinks ([
					{id: desc_cocina, action: { choiceId: "action", actionId:"ex", o1Id: "nevera"} }
				])


			}

		});

		items.push ({
			id: 'pasillo',

			desc: function () {

				var cuadroVisto = (usr.getValue({id:"cuadro1"}) != 0)
				var posterVisto = (usr.getValue({id:"póster"}) != 0)
				var espejoVisto = (usr.getValue({id:"espejo"}) != 0)
				var ratonPresente = (primitives.IT_GetLoc(primitives.IT_X("ratón")) != primitives.IT_X("limbo"))

				primitives.GD_CreateMsg ("es","pasillo_cuadro", "Observas un %l1 con los miembros de la familia. ")
				primitives.GD_CreateMsg ("es","pasillo_hab_común", "Sólo es un pasillo que conduce ");
				primitives.GD_CreateMsg ("es","pasillo_hab_padres", " %l1 y sobre la que ves un escudo con un lobo que pelea con una serpiente casi tan grande como él; ");
				primitives.GD_CreateMsg ("es","pasillo_hab_hijos", " %l1; ");
				primitives.GD_CreateMsg ("es","pasillo_poster", ", supones por %l1 de un grupo de rock gótico a la entrada, ");
				primitives.GD_CreateMsg ("es","pasillo_hab_abuelo", " y a una tercera habitación, sin nada digno de remarcar... salvo la ausencia de todo: una puerta lisa y negra, sin pomo.<br/>");

				var msg_pasillo_cuadro = primitives.CA_ShowMsg ("pasillo_cuadro", {l1: {id: "pasillo_cuadro", txt: "cuadro"}}, !cuadroVisto);
				var msg_pasillo_hab_hijos_comun = primitives.CA_ShowMsg ("pasillo_hab_común")

				var msg_pasillo_hab_padres = primitives.CA_ShowMsg ("pasillo_hab_padres", {l1: {id: "pasillo_hab_padres", txt: "a la habitación que preside las escaleras"}}, !espejoVisto )

				var msg_pasillo_hab_hijos = primitives.CA_ShowMsg ("pasillo_hab_hijos", {l1: {id: "pasillo_hab_hijos", txt: "a la habitación de los hijos"}}, ratonPresente )

				var msg_pasillo_poster = primitives.CA_ShowMsg ("pasillo_poster", {l1: {id: "pasillo_poster", txt: "el póster"}}, !posterVisto & ratonPresente)
				var msg_pasillo_hab_abuelo = primitives.CA_ShowMsg ("pasillo_hab_abuelo" )

				primitives.GD_DefAllLinks ([
					{ id:msg_pasillo_cuadro, action: { choiceId: "action", actionId:"ex", o1Id: "cuadro1"}},
					{ id:msg_pasillo_poster, action: { choiceId: "action", actionId:"ex", o1Id: "póster"}, serCode: {functionId:'setValue', par: {id:"póster", value:"1"}} },
					{ id:msg_pasillo_hab_padres, action: { choiceId: "dir1", actionId:"go", target: primitives.IT_X("hab_padres"), targetId: "hab_padres", d1Id:"d0", d1: primitives.DIR_GetIndex("d0")}},
					{ id:msg_pasillo_hab_hijos, action: { choiceId: "dir1", actionId:"go", target: primitives.IT_X("hab_hijos"), targetId: "hab_hijos", d1Id:"d270", d1: primitives.DIR_GetIndex("d270")}}
				])

			}

		});

		items.push ({
			id: 'hab-padres',

			desc: function () {

				primitives.GD_CreateMsg ("es","desc-hab-padres-1", "Qué desagradable, un crucifijo invertido preside una cama enorme, de unos tres por tres metros. La cama está sin hacer y las sábanas están llenas de manchas cuya naturaleza quizás sea mejor no saber. Un gran espejo en el techo habla de la morbosidad de sus ocupantes.<br/>");
				primitives.CA_ShowMsg ("desc-hab-padres-1")

			}

		});

		items.push ({
			id: 'hab-hijos',

			desc: function () {

				// to-do: usar links
				// si das queso -> sale el ratón, coge queso, y se van ambos animales.
				// ¿qué pasa si no tienes el queso? En vez de resolverse la situación dando el queso, aparecería un objeto en la habitación que podrías usar ahí mismo: quizás debajo de la alfombra o similar.

				var ratonVisto = (usr.getValue ({id:"ratón"}) != "0")
				var gatoVisto = (usr.getValue ({id:"gato"}) != "0")

				primitives.GD_CreateMsg ("es","desc-hab-hijos-1", "¿Una litera? No te quieres ni imaginar las peleas por el territorio entre los dos hermanos Raritos, que no dejan de pelear todo el rato en el colegio.<br/>");
				primitives.GD_CreateMsg ("es","desc-hab-hijos-ratón", "Al lado de la cama inferior, hay un agujero del tamaño de una pelota de tenis en la base de la pared")
				primitives.GD_CreateMsg ("es","desc-hab-hijos-ratón-presente", ", del que asoma el hocico de un %l1.");
				primitives.GD_CreateMsg ("es","desc-hab-hijos-gato-presente", "En otra esquina de la habitación, entre sombras, un %l1 mira casi todo el tiempo hacia el agujero, ignorándote activamente mientras se lame las uñas. No lo podrías jurar, pero ¿tiene maquillaje en los ojos?<br/>");


				var ratonHay = primitives.IT_IsHere(primitives.IT_X("ratón"))
				var gatoHay = primitives.IT_IsHere(primitives.IT_X("gato"))

				primitives.CA_ShowMsg ("desc-hab-hijos-1")
				primitives.CA_ShowMsg ("desc-hab-hijos-ratón")
				var msg_raton_presente = primitives.CA_ShowMsg ("desc-hab-hijos-ratón-presente", {l1: {id: "ratoncito", txt: "ratoncito"}}, ratonHay & !ratonVisto)

				primitives.CA_ShowMsgAsIs (". ")
				var msg_gato_presente = primitives.CA_ShowMsg ("desc-hab-hijos-gato-presente", {l1: {id: "gato", txt: "gato"}}, gatoHay & !gatoVisto)

				primitives.GD_DefAllLinks ([
					{ id: msg_raton_presente, action: { choiceId: "action", actionId:"ex", o1Id: "ratón"} } ,
					{ id: msg_gato_presente,  action: { choiceId: "action", actionId:"ex", o1Id: "gato"} }
				])

			}

		});

		items.push ({
			id: 'hab-abuelos',

			desc: function () {

				primitives.GD_CreateMsg ("es","desc-hab-abuelos", "Suelo y paredes de mármol, gélido y un ataúd flanqueado por dos velas inmensas encendidas. Sobre el ataúd un cuadro.<br/>");
				primitives.CA_ShowMsg ("desc-hab-abuelos")

			}

		});

		items.push ({
			id: 'cuadro1',


			desc: function () {


				let familiaActivation = [
					(primitives.IT_GetAttPropValue (primitives.IT_X("cuadro1"), "familiaState", "padre") == "0"),
					(primitives.IT_GetAttPropValue (primitives.IT_X("cuadro1"), "familiaState", "madre") == "0"),
					(primitives.IT_GetAttPropValue (primitives.IT_X("cuadro1"), "familiaState", "hija") == "0"),
					(primitives.IT_GetAttPropValue (primitives.IT_X("cuadro1"), "familiaState", "hijo") == "0"),
					(primitives.IT_GetAttPropValue (primitives.IT_X("cuadro1"), "familiaState", "abuelo") == "0") ]

				let bis_active = !(familiaActivation[0] || familiaActivation[1] || familiaActivation[2] || familiaActivation[3] || familiaActivation[4])


				// si no se han visto ya todos, no mostrar opciones habituales sino sólo los enlaces
				if (!bis_active) {primitives.CA_EnableChoices(false)}

				primitives.GD_CreateMsg ("es","el_cuadro_1", "La familia Rarita al completo: ");

				primitives.GD_CreateMsg ("es","el_cuadro_2", "el %l1, ");
				primitives.GD_CreateMsg ("es","el_cuadro_2_bis", "el Papá Rarito, con un lobo a sus pies; ");

				primitives.GD_CreateMsg ("es","el_cuadro_3", "la %l1, ");
				primitives.GD_CreateMsg ("es","el_cuadro_3_bis", "la Mamá Rarita, con una serpiente inmensa como bufanda; ");
				primitives.GD_CreateMsg ("es","el_cuadro_4", "la %l1, ");
				primitives.GD_CreateMsg ("es","el_cuadro_4_bis", "la Chica Rarita y su look gótico-punk, acariciando a un gato negro; ");
				primitives.GD_CreateMsg ("es","el_cuadro_5", "el %l1, y ");
				primitives.GD_CreateMsg ("es","el_cuadro_5_bis", "el Niño Rarito, jugando con un orondo ratón; ");
				primitives.GD_CreateMsg ("es","el_cuadro_6", ", el %l1,");
				primitives.GD_CreateMsg ("es","el_cuadro_6_bis", "el Abuelo Rarito, con un murciélago en el hombro;");
				primitives.GD_CreateMsg ("es","el_cuadro_7", "y %l1.<br/>");
				primitives.GD_CreateMsg ("es","el_cuadro_7_bis", "y una figura borrada a cuchilladas, que deja entrever a una señora mayor también con un murciélago sobre su hombro. Si existió una Abuela Rarita en la familia es algo que desconocías hasta ahora. ¿Por qué habrán querido destrozar su recuerdo de manera tan cruel?<br/>");

				primitives.CA_ShowMsg ("el_cuadro_1")

				var msg_cuadro_2 = primitives.CA_ShowMsg ("el_cuadro_2", {l1: {id: "cuadro_2", txt: "Papá Rarito"}}, !bis_active)
				var msg_cuadro_2_bis = primitives.CA_ShowMsg ("el_cuadro_2_bis", undefined, bis_active)

				var msg_cuadro_3 = primitives.CA_ShowMsg ("el_cuadro_3", {l1: {id: "cuadro_3", txt: "Mamá Rarita"}}, !bis_active)
				var msg_cuadro_3_bis = primitives.CA_ShowMsg ("el_cuadro_3_bis", undefined, bis_active)
				var msg_cuadro_4 = primitives.CA_ShowMsg ("el_cuadro_4", {l1: {id: "cuadro_4", txt: "Chica Rarita"}}, !bis_active)
				var msg_cuadro_4_bis = primitives.CA_ShowMsg ("el_cuadro_4_bis", undefined, bis_active)
				var msg_cuadro_5 = primitives.CA_ShowMsg ("el_cuadro_5", {l1: {id: "cuadro_5", txt: "Niño Rarito"}}, !bis_active)
				var msg_cuadro_5_bis = primitives.CA_ShowMsg ("el_cuadro_5_bis", undefined, bis_active)
				var msg_cuadro_6 = primitives.CA_ShowMsg ("el_cuadro_6", {l1: {id: "cuadro_6", txt: "Abuelo Rarito"}}, !bis_active)
				var msg_cuadro_6_bis = primitives.CA_ShowMsg ("el_cuadro_6_bis", undefined, bis_active)
				var msg_cuadro_7 = primitives.CA_ShowMsg ("el_cuadro_7", {l1: {id: "cuadro_7", txt: "una figura borrada a cuchilladas"}}, !bis_active)
				var msg_cuadro_7_bis = primitives.CA_ShowMsg ("el_cuadro_7_bis", undefined, bis_active)

				/*
				here!
				error:
				actualmente, es setFrame el que devuelve  (status.enableChoices == true)
				lo que produce el  this.setEnableChoices(true)
		     Pero al pasar a setValue de libCode, ahora no hay nadie que lo haga

				*/

				primitives.GD_DefAllLinks ([
					// activatedBy: cuadro1.familiaState.X

					{ id: msg_cuadro_2, changeTo: msg_cuadro_2_bis, userCode: {functionId: "setFrame", par: {pnj:"padre"} }, activatedBy: "cuadro1.familiaState.padre" },
					{ id: msg_cuadro_3, changeTo: msg_cuadro_3_bis, userCode: {functionId: "setFrame", par: {pnj:"madre"} }, activatedBy: "cuadro1.familiaState.madre" },
					{ id: msg_cuadro_4, changeTo: msg_cuadro_4_bis, userCode: {functionId: "setFrame", par: {pnj:"chica"} }, activatedBy: "cuadro1.familiaState.chica"	},
					{ id: msg_cuadro_5, changeTo: msg_cuadro_5_bis, userCode: {functionId: "setFrame", par: {pnj:"niño"} }, activatedBy: "cuadro1.familiaState.niño" 	},
					{ id: msg_cuadro_6, changeTo: msg_cuadro_6_bis, userCode: {functionId: "setFrame", par: {pnj:"abuelo"} }, activatedBy: "cuadro1.familiaState.abuelo" },
					{ id: msg_cuadro_7, changeTo: msg_cuadro_7_bis, userCode: {functionId: "setFrame", par: {pnj:"abuela"} }, activatedBy: "cuadro1.familiaState.abuela" }
				])

			}

		});


		items.push ({
			id: 'chimenea',


			desc: function () {

				var jaulaVisto = (usr.getValue ({id:"jaula"}) != "0")

				primitives.GD_CreateMsg ("es","chimenea_1", "Entre carbón y madera quemada observas los restos de %l1.");
				primitives.GD_CreateMsg ("es","chimenea_1_bis", "Entre carbón y madera quemada observas los restos de una jaula chamuscada. ");

				var msg_chimenea_1 = primitives.CA_ShowMsg ("chimenea_1", {l1: {id: "chimenea_1", txt: "una jaula chamuscada"}}, !jaulaVisto)
				var msg_chimenea_1_bis = primitives.CA_ShowMsg ("chimenea_1_bis", false, jaulaVisto)

				var huesosVisto = (usr.getValue ({id:"huesos"}) != "0")

				primitives.GD_CreateMsg ("es","jaula_1", "Dentro puedes ver unos %l1 ")
				primitives.GD_CreateMsg ("es","jaula_1_bis", "Dentro puedes ver unos pequeños huesitos, ")
				var msg_jaula_1 = primitives.CA_ShowMsg ("jaula_1", {l1: {id: "jaula_1", txt: "pequeños huesitos."}}, jaulaVisto & !huesosVisto)
				var msg_jaula_1_bis = primitives.CA_ShowMsg ("jaula_1_bis", undefined, jaulaVisto & huesosVisto)

				primitives.GD_CreateMsg ("es","huesos_1", "como de ratón o murciélago. Capaz que estos bárbaros lo han quemado, ya sea para comérselo o a saber para qué innominioso ritual. ¿Cómo vas a poder conseguir el trofeo? Puedes %l1, o bien seguir investigando. Si consigues un trofeo mejor, quizás tus amigos te lo acepten.<br/>");
				primitives.GD_CreateMsg ("es","huesos_1_bis", "como de ratón o murciélago. Capaz que estos bárbaros lo han quemado, ya sea para comérselo o a saber para qué innominioso ritual. ¿Cómo vas a poder conseguir el trofeo? Puedes sacarle una foto a la jaula y volverte a casa, o bien seguir investigando. Si consigues un trofeo mejor, quizás tus amigos te lo acepten.");
				var msg_huesos_1 = primitives.CA_ShowMsg ("huesos_1", {l1: {id: "huesos_1", txt: "sacarle una foto a la jaula y volverte a casa"}}, jaulaVisto & huesosVisto)
				var msg_huesos_1_bis = primitives.CA_ShowMsg ("huesos_1_bis", undefined, jaulaVisto & !huesosVisto)

				primitives.GD_DefAllLinks ([
					{ id: msg_chimenea_1, changeTo: msg_chimenea_1_bis, visibleToTrue: [msg_jaula_1], libCode: {functionId:'setValue', par: {id:"jaula", value:"1"}} },
					{ id: msg_jaula_1, changeTo: msg_jaula_1_bis, visibleToTrue: [msg_huesos_1] , libCode: {functionId:'setValue', par: {id:"huesos", value:"1"}} },
					{ id: msg_huesos_1, changeTo: msg_huesos_1_bis, action: { choiceId: "action", actionId:"sacar_foto", o1Id: "móvil"} }
				])
			}

		});

		items.push ({
			id: 'nevera',

			desc: function () {

				var item1 = primitives.IT_X("nevera")
				if (primitives.IT_GetAttPropValue (item1, "generalState", "state") == "0") {
					primitives.GD_CreateMsg ("es","desc_nevera", "La abres con repuganancia y descubres con sorpresa que está fría. Tiene una lucecita encendida en el interior, a pesar de que el cable que sale de la nevera cuelga, pelado, sin conectar a ningún enchufe.")
					primitives.CA_ShowMsg ("desc_nevera")
					primitives.IT_SetAttPropValue (item1, "generalState", "state", "1");
					// que no pasen a estar en la nevera hasta que se describa la primera vez
					primitives.IT_SetLoc(primitives.IT_X("botella"), item1);
					primitives.IT_SetLoc(primitives.IT_X("taper"), item1);
					primitives.IT_SetLoc(primitives.IT_X("dinamita"), item1);
					primitives.IT_SetLoc(primitives.IT_X("queso"), item1);
				} else {
					primitives.GD_CreateMsg ("es","desc_nevera_2", "La vuelves a abrir, fascinado por su repugnancia.")
					primitives.CA_ShowMsg ("desc_nevera_2")
				}

				var botellaHay = (primitives.IT_GetLoc(primitives.IT_X("botella")) == item1)
				var taperHay = (primitives.IT_GetLoc(primitives.IT_X("taper")) == item1)
				var dinamitaHay = (primitives.IT_GetLoc(primitives.IT_X("dinamita")) == item1)
				var quesoHay = (primitives.IT_GetLoc(primitives.IT_X("queso")) == item1)
				var mostrarContenido = (botellaHay || taperHay || dinamitaHay || quesoHay)
				var botellaVisto = (primitives.IT_GetAttPropValue (primitives.IT_X("botella"), "generalState", "state") == "1")
				var taperVisto = (primitives.IT_GetAttPropValue (primitives.IT_X("taper"), "generalState", "state") != "0")
				var dinamitaVisto = (primitives.IT_GetAttPropValue (primitives.IT_X("dinamita"), "generalState", "state") == "1")
				var quesoVisto = (primitives.IT_GetAttPropValue (primitives.IT_X("queso"), "generalState", "state") == "1")

				primitives.GD_CreateMsg ("es", "dentro_de_nevera", "Dentro de la nevera hay:<br/>");
				primitives.CA_ShowMsg ("dentro_de_nevera", undefined, mostrarContenido)

				primitives.GD_CreateMsg ("es","desc_botella_1", "- %l1<br/>");
				var msg_desc_botella_1 = primitives.CA_ShowMsg ("desc_botella_1",  {l1: {id: "desc_botella_1", txt: "una botella"}} , botellaHay && !botellaVisto)
				primitives.GD_CreateMsg ("es","desc_botella_1_bis", "- una botella con un líquido rojo que no parece vino.<br/>");
				var msg_desc_botella_1_bis = primitives.CA_ShowMsg ("desc_botella_1_bis", undefined , botellaHay && botellaVisto)

				primitives.GD_CreateMsg ("es","desc_taper_1", "- %l1<br/>");
				var msg_desc_taper_1 = primitives.CA_ShowMsg ("desc_taper_1",  {l1: {id: "desc_taper_1", txt: "un táper"}} , taperHay && !taperVisto)
				primitives.GD_CreateMsg ("es","desc_taper_1_bis", "- un  táper con cosas moviéndose dentro.<br/>");
				var msg_desc_taper_1_bis = primitives.CA_ShowMsg ("desc_taper_1_bis", undefined , taperHay && taperVisto)

				primitives.GD_CreateMsg ("es","desc_dinamita_1", "- %l1<br/>");
				var msg_desc_dinamita_1 = primitives.CA_ShowMsg ("desc_dinamita_1",  {l1: {id: "desc_dinamita_1", txt: "una barra de dinamita"}} , dinamitaHay && !dinamitaVisto)
				primitives.GD_CreateMsg ("es","desc_dinamita_1_bis", "- una barra de dinamita, ¿en serio?<br/>");
				var msg_desc_dinamita_1_bis = primitives.CA_ShowMsg ("desc_dinamita_1_bis", undefined , dinamitaHay && dinamitaVisto)

				primitives.GD_CreateMsg ("es","desc_queso_1", "- %l1<br/>");
				var msg_desc_queso_1 = primitives.CA_ShowMsg ("desc_queso_1",  {l1: {id: "desc_queso_1", txt: "queso"}} , quesoHay && !quesoVisto)
				primitives.GD_CreateMsg ("es","desc_queso_1_bis", "- queso maloliente<br/>");
				var msg_desc_queso_1_bis = primitives.CA_ShowMsg ("desc_queso_1_bis", undefined , quesoHay && quesoVisto)

				primitives.GD_CreateMsg ("es","desc_nevera_3", "Pero ya no queda nada de su contenido original.<br/>");
				primitives.CA_ShowMsg ("desc_nevera_3", undefined, !mostrarContenido)

				primitives.GD_DefAllLinks ([
					{ id: msg_desc_botella_1, changeTo: msg_desc_botella_1_bis,
						libCode: {functionId: "setValue", par: {id:"botella", value:"1"}}
					},
					{ id: msg_desc_taper_1, changeTo: msg_desc_taper_1_bis,
						libCode: {functionId: "setValue", par: {id:"taper", value:"1"}}
					},
					{ id: msg_desc_dinamita_1, changeTo: msg_desc_dinamita_1_bis,
						libCode: {functionId: "setValue", par: {id:"dinamita", value:"1"}}
					},
					{ id: msg_desc_queso_1, changeTo: msg_desc_queso_1_bis,
						libCode: {functionId: "setValue", par: {id:"queso", value:"1"}}
					}
				])

			}

		});

		items.push ({
			id: 'espejo',


			desc: function () {
				usr.escena_espejo()
			}

		});

		items.push ({
			id: 'póster',


			desc: function () {

				var posterVisto = (usr.getValue({id:"póster"}) != 0)

				primitives.GD_CreateMsg ("es","póster_1", "Ves las ropas y poses típicas de un grupo de rock gótico llamado Los Ultratumba y una estrofa de una cancion del grupo.");
				primitives.GD_CreateMsg ("es","póster_2", "La canción reza así:");
				primitives.GD_CreateMsg ("es","póster_3", "Dame tu sangre<br/>Si quieres entrar<br/>Dame su sangre<br/>Al mundo infernal.<br/>");

				primitives.CA_ShowMsg ("póster_1" )
				primitives.CA_ShowMsg ("póster_2" )
				if (!posterVisto) {primitives.CA_PressKey ("tecla");}
				primitives.CA_ShowMsg ("póster_3" )
				usr.setValue ({id:"póster", value:"1"})

			}
		});

		items.push ({
			id: 'gato',

			desc: function () {

				primitives.GD_CreateMsg ("es","gato_1", "El gato, ¿o será gata?, parece tener pintada una cresta punky y los ojos maquillados. No te presta la menor atención, ocupado observando el agujero al otro lado de la habitación.");
				primitives.CA_ShowMsg ("gato_1" )
				usr.setValue({id:"gato"}, "1")
			}
		});


			items.push ({
				id: 'ratón',

				desc: function () {

					primitives.GD_CreateMsg ("es","ratón_1", "Además de ver su húmedo hocico y sus bigotes moverse entre las sombas, en algún momento se gira y ves por su tamaño que no le falta basura que comer en esta casa.");
					primitives.CA_ShowMsg ("ratón_1" )
					usr.setValue({id:"ratón"}, "1")

				}
			});

			items.push ({
				id: 'cuadro2',

				desc: function () {

					primitives.GD_CreateMsg ("es","cuatro2_1", "Es un retato nupcial en el que se observa al Abuelo Rarito de joven, acompañado de su mujer. El cuadro está en perfecto estado, sin una rozadura.");
					primitives.CA_ShowMsg ("cuatro2_1" )
				}
			});

			items.push ({
				id: 'ataúd',

				desc: function () {

					primitives.GD_CreateMsg ("es","ataúd_1", "Te lo quedas mirando largos minutos. Sabes que no puedes salir y que todo te lleva a meterte en esa caja mortuoria de mármol.");
					primitives.GD_CreateMsg ("es","ataúd_2", "Entras y tanteas el interior. La tapa tiene unas agarraderas que permiten desplazarla y quedarte encerrado, como así haces.");
					primitives.GD_CreateMsg ("es","ataúd_3", "Tierra cayendo sobre tu ataúd, gritos de '¡Monstruo!', ¡ahí te pudras toda la eternidad!<br/>La sangre de la doncella estuvo deliciosa y esos cafres no te clavaron ninguna estaca. Sólo será una siestita de unos años, y volverás a la superficie, en uno de tus saltos temporales al futuro.");
					primitives.GD_CreateMsg ("es","ataúd_4", "Ya no estás en el ataúd sino de vuelta en el hall de la mansión.")

					primitives.CA_ShowMsg ("ataúd_1" )
					primitives.GD_CreateMsg ("es","tecla-ataúd-1", "Entra en el ataúd")
					primitives.CA_PressKey ("tecla-ataúd-1");
					primitives.CA_ShowMsg ("ataúd_2" )
					primitives.CA_PressKey ("tecla");
					primitives.CA_ShowMsg ("ataúd_3" )
					primitives.GD_CreateMsg ("es","tecla-ataúd-2", "Vuelves al presente")
					primitives.CA_PressKey ("tecla-ataúd-2");
					primitives.CA_ShowMsg ("ataúd_4" )

					usr.setValue({id:"ataúd"}, "1")
					primitives.PC_SetCurrentLoc(primitives.IT_X("hall"))

				}
			});

	},

	initReactions: function  (reactions, primitives) {

		// acciones de lib deshabilitadas
		reactions.push ({ id: 'jump', enabled: function (indexItem, indexItem2) {		return false		}	});
		reactions.push ({ id: 'sing', enabled: function (indexItem, indexItem2) {		return false		}	});
		reactions.push ({ id: 'wait', enabled: function (indexItem, indexItem2) {		return false		}	});


		reactions.push ({
			id: 'look',

			enabled: function (indexItem, indexItem2) {
				if (primitives.PC_GetCurrentLoc() == primitives.IT_X("intro1")) { return false }
				if (primitives.PC_GetCurrentLoc() == primitives.IT_X("intro2")) { return false }
			},

			reaction: function (par_c) {

				/*if (par_c.loc == primitives.IT_X("intro1")) {
					return true // not to redescribe
				}
				*/

			}

		}); // look

		reactions.push ({
			id: 'go',

			reaction: function (par_c) {

				if (par_c.target == primitives.IT_X("intro2")) {

					primitives.GD_CreateMsg ("es", "intro2", "a intro2<br/>");
					primitives.CA_ShowMsg ("intro2")
					return false; // just a transition

				}

	 			if ((par_c.loc == primitives.IT_X("hall")) && (par_c.target == primitives.IT_X("porche")))  {
					primitives.GD_CreateMsg ("es", "al porche_1", "Huyes de la casa antes de tiempo, deshonra ante tus amigos<br/>La partida termina, pero seguro que puedes hacerlo mejor la próxima vez.<br/>");
					primitives.CA_ShowMsg ("al porche_1")
					primitives.CA_PressKey ("tecla");
					primitives.GD_CreateMsg ("es", "al porche_2", "Ahora, entre tú y yo, jugador, hagamos como que nunca has intentado salir, y continua la partida como si nada.<br/>");
					primitives.CA_ShowMsg ("al porche_2")
					//primitives.CA_EndGame("al porche_1")
					return true

				}

				if ((par_c.loc == primitives.IT_X("porche")) && (par_c.target == primitives.IT_X("hall")))  {

					if (!primitives.IT_IsCarried(primitives.IT_X("móvil"))) {
						primitives.GD_CreateMsg ("es", "entrar_sin_móvil", "El reto consiste en salir con una foto, ¿cómo vas a conseguirla si dejas la cámara fuera?<br/>");
						primitives.CA_ShowMsg ("entrar_sin_móvil")
						return true
					}

					//antes de intentar abrir esa majestuosa puerta. Apoyas la mano, seguro de que no abrirá y...
					// ?: "Al tocar el pomo la puerta lanzó un horripilante grito de bienvenida. El intruso dio un salto y casi se dio la vuelta, pero se sobrepuso y acabó de abrir la puerta. Sólo veía un poco alrededor, de la luz de la calle. Al encender la linterna vio que estaba ante un inmenso hall que con su exigua luz no podía apreciar de manera clara, como si en las sombras que quedaban fuera de su haz se movieran figuras amenazantes.<br/>");

					primitives.GD_CreateMsg ("es", "ruido_puerta", "Un pequeño empujón y el sonido lastimoso de la puerta al abrirse te suena como la madre del sonido de todas las puertas de las películas de terror de nunca jamás, como si esos presuntuosos ruidos no fueran más que una reproducción de mala calidad de lo que acabas de escuchar.");
					primitives.CA_ShowMsg ("ruido_puerta")
					primitives.CA_PressKey ("tecla");
					return false

				}

				if ((par_c.loc == primitives.IT_X("pasillo")) && (par_c.target == primitives.IT_X("hab-hijos")))  {
					if (primitives.IT_GetLoc(primitives.IT_X("ratón")) == primitives.IT_X("limbo")) {
						primitives.GD_CreateMsg ("es", "hab_hijos_sellada", "De alguna manera, ya sabes que no hay nada más que hacer en esta habitación.\n")
						primitives.CA_ShowMsg ("hab_hijos_sellada")
						return true
					}
				}

				if ((par_c.loc == primitives.IT_X("pasillo")) && (par_c.target == primitives.IT_X("hab-padres")))  {
					if (usr.getValue ({id:"espejo"}) == "1") {
						primitives.GD_CreateMsg ("es", "hab_padres_sellada", "Ni por lo más sagrado volverás a entrar en esa habitación y su horrendo espejo.\n")
						primitives.CA_ShowMsg ("hab_padres_sellada")
						return true
					}
				}

				if (par_c.loc == primitives.IT_X("hab-padres"))  {
					if (primitives.IT_GetAttPropValue (primitives.IT_X("espejo"), "generalState", "state") == "0") {
						primitives.GD_CreateMsg ("es", "mirar_espejo", "Cuando vas a salir, no puedes evitar dejar de observar el espejo.\n")
						primitives.CA_ShowMsg ("mirar_espejo")
						usr.escena_espejo()
						return false
					}
			  }

				if ((par_c.loc == primitives.IT_X("pasillo")) && (par_c.target == primitives.IT_X("hab-abuelos")))  {
					if (usr.getValue({id:"ataúd"}) == "1") {
						primitives.GD_CreateMsg ("es", "entrar_hab_abuelos_ya", "Los que quiera que te dejaron entrar una vez, no parecen querer que sigas merodeando por su casa.<br/>")
						primitives.CA_ShowMsg ("entrar_hab_abuelos_ya")
						return true
					} else if (primitives.IT_GetLoc(primitives.IT_X("botella-vacía")) == primitives.IT_X("limbo")) {
						primitives.GD_CreateMsg ("es", "entrar_hab_abuelos_no", "La puerta no tiene pomo. Está tremendamente fría y es como un mármol negro y oscuro que no refleja la luz. Empujas la puerta, pero eres incapaz de abrirla.<br/>")
						primitives.CA_ShowMsg ("entrar_hab_abuelos_no")
						return true
					} else {
						primitives.GD_CreateMsg ("es", "entrar_hab_abuelos_sí", "Apoyas tus manos cubiertas de sangre en la fría puerta de mármol negro y notas cómo se abre sin hacer ningún ruido. Al entrar descubres que se cierra detrás tuya con igual discreción.<br/>")
						primitives.CA_ShowMsg ("entrar_hab_abuelos_sí")
						return false
					}
				}

				if ((par_c.loc == primitives.IT_X("hab-abuelos")))  {
					primitives.GD_CreateMsg ("es", "salir_hab_abuelos_no", "No encuentras la manera de abrir la fría puerta de mármol.<br/>")
					primitives.CA_ShowMsg ("salir_hab_abuelos_no")
					return true
				}

			}

		}); // go

		reactions.push ({
			id: 'goto',

			/*enabled: function (indexItem, indexItem2) {
				alert ("debug goto.enabled: " + indexItem)
				return true
			},
			*/

			reaction: function (par_c) {

				if ((par_c.loc == primitives.IT_X("intro2")) && (par_c.item1Id == "porche"))  {
					primitives.GD_CreateMsg ("es", "de_intro_a_porche", "Trastabillas y te caes, te arañas con los arbustos, y casi pierdes el móvil, pero llegas hasta el porche y recuperas el aliento.<br/>");
					primitives.CA_ShowMsg ("de_intro_a_porche")
					primitives.GD_CreateMsg ("es","mira","mira")
					primitives.CA_PressKey ("mira");
					return false
				}

			}

		}); // go-to

		reactions.push ({

			id: 'sacar_foto',

			enabled: function (indexItem, indexItem2) {

				if (indexItem != primitives.IT_X("móvil")) return false;
				return true;
			},

			reaction: function (par_c) {
				// si en hall y ya has visto los huesos => significa que te vas a tu casa
				if ((par_c.loc == primitives.IT_X("hall")) && (usr.getValue({id:"huesos"}) == "1") )  {
					usr.setValue({id:"huesos", value:"2"})
					primitives.GD_CreateMsg ("es", "te_vas_si_pero_no_1", "Sacas las fotos a esos míseros huesos y te diriges a la puerta.<br/>");
					primitives.GD_CreateMsg ("es", "te_vas_si_pero_no_2", "Pero cuando vas a girar el pomo de la puerta oyes las risas de desprecio de tus amigos y con rabia das la vuelta. ¡Los vas a dejar muditos!<br/>");

					primitives.CA_ShowMsg ("te_vas_si_pero_no_1");
					primitives.CA_PressKey ("tecla");
					primitives.CA_ShowMsg ("te_vas_si_pero_no_2");

					return true;
				}

				if ((par_c.loc == primitives.IT_X("cocina")) && (primitives.IT_GetLocId(primitives.IT_X("botella") ) == "limbo") && (usr.getValue({id:"botella"}) != "2"))  {
					usr.setValue({id:"botella", value:"2"})
					primitives.GD_CreateMsg ("es", "selfie_de_sangre", "Te sacas un selfie, pero cuando ves a esa cara demacrada cuberta de sangre, lo borras para no dejar rastro de tu vergüenza.<br/>");

					primitives.CA_ShowMsg ("selfie_de_sangre");

					return true;

				}


				primitives.GD_CreateMsg ("es", "sacas_foto", "Sacas una foto sin ton ni son.<br/>");
				primitives.CA_ShowMsg ("sacas_foto");


				return true;
			}


		});

		reactions.push ({

			id: 'drop',

			reaction: function (par_c) {

				if (par_c.item1Id == "móvil") {
					primitives.GD_CreateMsg ("es","dejar_móvil", "Aunque ilumina poco, sin él no verías casi nada en la casa. Además, ¿cómo sacarás la foto que necesitas sin él? Lo dejas estar.<br/>")
					primitives.CA_ShowMsg ("dejar_móvil")
					return true
				}

			if (par_c.item1Id == "queso") {
				if (primitives.PC_GetCurrentLocId() == "hab-hijos") {
					// escena pelea ratón y gato
					primitives.GD_CreateMsg ("es","dar_queso_1", "Al dejarle en el suelo el queso al ratón, el ratón sale tímidamente de su agujero, y el gato se abalanza sobre él.")
					primitives.GD_CreateMsg ("es","dar_queso_2", "El gato le propina un par de zarpazos, pero el ratón lo mira con unos llameantes ojos rojos que hacen arder la cola del gato, por lo que sale corriendo de la habitación mientras el ratón se va con el queso a su agujero, triunfante esta vez.<br/>")

					primitives.CA_ShowMsg ("dar_queso_1")
					primitives.CA_PressKey ("tecla");
					primitives.CA_ShowMsg ("dar_queso_2")
					primitives.IT_SetLocToLimbo(par_c.item1)
					primitives.IT_SetLocToLimbo(primitives.IT_X("ratón"))
					primitives.IT_SetLocToLimbo(primitives.IT_X("gato"))
					usr.setValue({id:"ratón", value:"1"})
					usr.setValue({id:"gato", value:"1"})
					return true
				}
			}
			return false
		}

		});

		reactions.push ({

			id: 'listen',

			enabled: function (indexItem, indexItem2) {

				if (indexItem != primitives.IT_X("chimenea")) return false;
				return true;
			},


			reaction: function (par_c) {

				var escena = usr.escenas_pendientes()
				primitives.GD_CreateMsg ("es","escuchas_1", "Una voz lejana y amable te susurra:<br/>")
				primitives.CA_ShowMsg ("escuchas_1")
				primitives.CA_ShowMsgAsIs (escena)

				if (escena == "done") {
					usr.escenaFinal()
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
						primitives.GD_CreateMsg ("es","coger_dinamita", "Al coger la dinamita todo se vuelve oscuro.")
						primitives.CA_ShowMsg ("coger_dinamita")
					} else {
						primitives.GD_CreateMsg ("es","coger_botella", "Nunca has bebido alcohol en tu vida, pero esta casa te está dando tanto miedo que crees que echarte un trago te hará sacudírtelo de encima. Pero nada más abrirlo te das cuenta de que eso no es vino, sino... los efluvios que salen de la botella te transportan a otro mundo.")
						primitives.CA_ShowMsg ("coger_botella")
					}
					primitives.CA_PressKey ("tecla");

					primitives.GD_CreateMsg ("es","coger_dinamita_11", "Estás en mitad de un combate de principios de siglo 20, en las trincheras. Un enemigo a caballo salta hacia ti. Coges la dinamita, se la arrojas. Caballo y jinete saltan por los aires en pedazos, y sobre ti caen jirones de carne y mucha sangre.<br/>")
					primitives.GD_CreateMsg ("es","coger_dinamita_12", "Te estás muriendo desangrado, pero llega una especie de ratón volador, un murciélago que se posa en tu pecho y te mira con mirada inquisidora.<br/>")
					primitives.GD_CreateMsg ("es","coger_dinamita_13", "Sin saber muy bien por qué, con tu último álito vital, asientas, ladeas la cabeza y dejas que el bicho te muerda en el cuello.<br/>")
					primitives.CA_ShowMsg ("coger_dinamita_11")
					primitives.CA_ShowMsg ("coger_dinamita_12")
					primitives.CA_ShowMsg ("coger_dinamita_13")
					primitives.CA_PressKey ("tecla");

					primitives.GD_CreateMsg ("es","coger_dinamita_21", 	"Al recuperar la consciencia, ya no tienes la dinamita en la mano, pero sí la botella, ahora vacía, de la nevera. Estás cubierto de sangre de cabeza a los pie , rodeado de un charco alrededor.<br/>");
					primitives.GD_CreateMsg ("es","coger_dinamita_22", 	"Al volver en sí, te tocas el cuello, pero no tienes nada.<br/>");
					primitives.CA_ShowMsg ("coger_dinamita_21")
					primitives.CA_ShowMsg ("coger_dinamita_22")

					primitives.GD_CreateMsg ("es","coger_dinamita_3", "¿No has tenido suficiente? %l1<br/>");
					var msg_coger_dinamita_3 = primitives.CA_ShowMsg ("coger_dinamita_3", {l1: {id: "coger_dinamita_3", txt: "¡Sácate un selfie y sale de esta casa diabólica por dios!"}} )
					//  (selfie -> la foto saldrá sin sangre)


					primitives.GD_DefAllLinks ([
						{ id:msg_coger_dinamita_3, action: { choiceId: "action", actionId:"sacar_foto", o1Id: "móvil"}}
					])

					primitives.IT_SetLocToLimbo (primitives.IT_X("dinamita"))
					primitives.IT_SetLocToLimbo (primitives.IT_X("botella"))
					primitives.IT_SetLoc (primitives.IT_X("botella-vacía"), primitives.PC_GetCurrentLoc())

					return true;
				}

				if (par_c.item1Id == "taper") {
					primitives.GD_CreateMsg ("es","coger_taper_1", "Al coger el táper lo miras con atención. Notas el movimiento en su interior, pero no puedes evitar abrirlo. Ves que lo que se mueve son gusanos, alimentándose de un pútrido trozo de carne. A pesar del asco, sientes fascinación hipnótica por toda esa maraña en movimiento y te descubres sin creértelo cogiendo un puñado y metiéndotelo en la boca.<br/>")
					primitives.GD_CreateMsg ("es","coger_taper_2", "Se estable una especie de diálogo entre esas hediondas criaturas y tú, que termina con el masticado de las mismas seguida de una visión en primera persona de la siguiente escena imposible:<br/>")
					primitives.GD_CreateMsg ("es","coger_taper_3", "Noche de brujas. Hoguera y luna llena. Estás encerrada (eres mujer) en una jaula transportada por personas de ambos sexo desnudas y con máscaras de animales. Gritas a medida que se acercan al fuego. Cada vez más calor. Dolor. Depositan la jaula dentro del fuego. Dolor imposible.<br/>")
					primitives.GD_CreateMsg ("es","coger_taper_4", "Sales del trance. El táper está en el suelo, rodeado del vómito que has debido de haber tenido, con algunos gusanos merodeando aún por ahí, pero estás tan avergonzado de lo que acaba de pasar que anulas el táper de tu visión, como si no existiera.<br/>")

					primitives.CA_ShowMsg ("coger_taper_1")
					primitives.CA_PressKey ("tecla");
					primitives.CA_ShowMsg ("coger_taper_2")
					primitives.CA_PressKey ("tecla");
					primitives.CA_ShowMsg ("coger_taper_3")
					primitives.CA_PressKey ("tecla");
					primitives.CA_ShowMsg ("coger_taper_4")
					primitives.CA_PressKey ("tecla");

					primitives.IT_SetLocToLimbo (par_c.item1)
					usr.setValue({id:"taper", value:"2"})
					return true;
				}

				if (par_c.item1Id == "queso") {

					if (usr.getValue ({id:"ratón"}) == "0") {
						primitives.GD_CreateMsg ("es","coger_queso_no", "Más de cerca, ves que el queso maloliente está cubierto de una capa grasienta de moho multicolor, lo tocas pero te da tanto asco que no lo coges.<br/>")
						primitives.CA_ShowMsg ("coger_queso_no")
						return true
					} else {
						primitives.GD_CreateMsg ("es","coger_queso_sí", "Es asqueroso, pero quizás... en la habitación de la litera...<br/>")
						primitives.CA_ShowMsg ("coger_queso_sí")
						return false

					}

				}


				return false

			}


		});


	},


	initAttributes: function  (attributes, primitives) {	},


	rellenaCeros: function (n, width) {
		// uso: rellenaCeros(10, 4) ->  // 0010
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
	},

	demo_action: function (par) {
	  alert ("PNJ: " + par.pnj + ": " + JSON.stringify (par))
	},

	goto: function (par) { // par.target

		var  primitives = this.primitives // tricky

	  console.log ("usr.goto: " + JSON.stringify (par))

		// transición
	//	if (par.target == "porche") {
			primitives.GD_CreateMsg ("es", "de_intro_a_porche", "Casi trastabillas y te caes, te arañas con los arbustos, y casi pierdes del móvil, pero llegas hasta el porche y recuperas el aliento.<br/>");
			primitives.CA_ShowMsg ("de_intro_a_porche")
			primitives.CA_PressKey ("tecla");
	//	}

		var loc = primitives.IT_X(par.target)
		// movimiento
		primitives.PC_SetCurrentLoc (loc)

		// redescribe
		primitives.CA_ShowDesc (loc)
		primitives.CA_Refresh()

	},

	setFrame: function (par) { // par.pnj

		let primitives = this.primitives // tricky
		let status = {}

		primitives.CA_EnableChoices(true)

	  console.log ("usr.setFrame: " + JSON.stringify (par))


		let familiaActivation = [
			(primitives.IT_GetAttPropValue (primitives.IT_X("cuadro1"), "familiaState", "padre") == "0"),
			(primitives.IT_GetAttPropValue (primitives.IT_X("cuadro1"), "familiaState", "madre") == "0"),
			(primitives.IT_GetAttPropValue (primitives.IT_X("cuadro1"), "familiaState", "hija") == "0"),
			(primitives.IT_GetAttPropValue (primitives.IT_X("cuadro1"), "familiaState", "hijo") == "0"),
			(primitives.IT_GetAttPropValue (primitives.IT_X("cuadro1"), "familiaState", "abuelo") == "0") ]

			let bis_active = !(familiaActivation[0] || familiaActivation[1] || familiaActivation[2] || familiaActivation[3] || familiaActivation[4])

			// si se han visto ya todos, mostrar opciones habituales
			if (bis_active) {
				//primitives.CA_EnableChoices(false)
				status.enableChoices = true
		}

		return status
	},

	setValue: function (par) { // par.id, par.value
		var primitives = this.primitives // tricky

	  primitives.IT_SetAttPropValue (primitives.IT_X(par.id), "generalState", "state", par.value)
	},

	getValue: function (par) { // par.id
		var primitives = this.primitives // tricky

	  return primitives.IT_GetAttPropValue (primitives.IT_X(par.id), "generalState", "state")
	},

	hiddenScene: function (par) { // par.pnj

		var primitives = this.primitives // tricky

		// "Créditos: Escena oculta 1:"
		// Hijo: ¿Habéis visto que hay alguien escondido detrás de los arbustos del jardín?
		// Padre: Sí, creo que es un compañero de clase, un friki de los juegos de rol.
		// El coche sale del aparcamiento de la casa.
		// Hijo:  ¿Viste, papá? No ha esperado ni a que giremos para entrar como un tiro en la casa.
		// Chica: Mirad allá, ese grupito de adolescentes en círculo de la esquina que no deja de lanzar miradas, además de a sus móviles, a la casa y al coche, son sus amiguetes. ¿Qué estarán tramando?
		// Abuelo: No os preocupéis, familia, ya sabéis que nuestras mascotas no permitirán que pase nada… que no deba pasar… ja, ja, ja…

	},

	escena_espejo: function () {

		var primitives = this.primitives // tricky

		primitives.GD_CreateMsg ("es","desc_espejo_1", "Lo observas absorto... las sombras en la cama parecen cobrar forma, una forma se mueve como, no!, es una serpiente de dos metros de manchas rojas y verdes, que se enrosca alrededor tuyo.")
		primitives.GD_CreateMsg ("es","desc_espejo_2", "Oyes un aullido al otro lado de la puerta, que se abre de golpe. La figura imponente de un lobo salta a la cama y te arroja fuera de ella con un zarpazo. La pelea de pasión y sexo que ves desplegarse delante tuya entre dos seres de naturaleza tan dispar, de seguro dejarán huella en tu psique el resto de tu vida. No lo pudes soportar y gritas, pierdes el aliento y caes al suelo.")
		primitives.GD_CreateMsg ("es","desc_espejo_post_1", "Al despertar descubres que estás fuera de la habitación, que está ahora cerrada con llave.")

		primitives.CA_ShowMsg ("desc_espejo_1")
		primitives.CA_PressKey ("tecla");
		primitives.CA_ShowMsg ("desc_espejo_2")
		primitives.CA_PressKey ("tecla");
		primitives.CA_ShowMsg ("desc_espejo_post_1")
		primitives.CA_PressKey ("tecla");

		usr.setValue ({id:"espejo", value:"1"})
		primitives.CA_PressKey ("tecla");
		primitives.PC_SetCurrentLoc(primitives.IT_X("pasillo"))

	},

	escenas_pendientes: function () {

		let suma = 0
		let escenas = ["sangre", "hambre", "espejo", "ataúd", "cuadro", "huesos", "gusanos"]
		let estado_escena = [false,false,false,false,false,false,false]

		let primitives = this.primitives // tricky

		estado_escena[0] = (primitives.IT_GetLoc(primitives.IT_X("botella-vacía")) == primitives.IT_X("limbo"))
		estado_escena[1] = (primitives.IT_GetLoc(primitives.IT_X("ratón")) != primitives.IT_X("limbo"))
		estado_escena[2] = (usr.getValue({id:"espejo"}) == "0")
		estado_escena[3] = (usr.getValue({id:"ataúd"}) == "0")
		estado_escena[4] = (usr.getValue({id:"cuadro1"}) == "0")
		estado_escena[5] = (usr.getValue({id:"huesos"}) == "0")
		estado_escena[6] = (usr.getValue({id:"taper"}) != "2")

		let pendientes = 0
		for (let i=0; i<estado_escena.length;i++) if (estado_escena[i]) pendientes++

		console.log("Debug: quedan " + pendientes + " cosas por hacer: " + JSON.stringify (pendientes))

		var elegido = primitives.MISC_Random(pendientes)

		for (let i=0, j=0; i<estado_escena.length;i++) {
			if (estado_escena[i]) {
				if (j==elegido) {
					return escenas[i]
				}
				j++;
			}
		}

		return "done"

	},

	escenaFinal: function () {

		var primitives = this.primitives // tricky

		primitives.GD_CreateMsg ("es","escena_final_1", "Suena el móvil! Los Raritos, ya están de vuelta! No sabes ni donde esconderte y acabas en el hall, debajo de una mesa, justo a tiempo cuando oyes abrir la puerta se abre en silencio dejando pasar las risas de la famila. Un click y la luz se enciende.<br/>")
	  primitives.GD_CreateMsg ("es","escena_final_2", "Todo es brillo y pulcritud.")
		primitives.GD_CreateMsg ("es","escena_final_3", "El niño sin dejar de comer golosinas sin parar, se te acerca, te lanza un ingenuo bú! y se va entre risas mientras le intenta poner la zancadilla a su hermana, que lo esquiva sin mayor esfuerzo y subes las escaleras a su habitación mientras escucha música de sus casos y sin prestarte la más mínima atención.")
		primitives.GD_CreateMsg ("es","escena_final_4", "Los padres te ofrecen la mano y te hacen salir de tu escondite.<br/>")
		primitives.GD_CreateMsg ("es","escena_final_5", "El: Parece que has tenido un memorable Halloween! Auuuuuuuuuuuu!<br/>")
		primitives.GD_CreateMsg ("es","escena_final_6", "Ella: No te dejezzzzzzz confundir, nada ezzzzzzz lo que parece zer.<br/>")
		primitives.GD_CreateMsg ("es","escena_final_7", "El abuelo se acerca a ti y sale contigo al porche, rodeados de plantas hermosas y sanas, echándote un amigable brazo al hombro.<br/>")
		primitives.GD_CreateMsg ("es","escena_abuelo_1", "Abuelo: Creo que después de esta noche no volverás a entrar en casas ajenas sin persono, ¿verdad?<br/>")
		primitives.GD_CreateMsg ("es","escena_abuelo_2", "Asientes")
		primitives.GD_CreateMsg ("es","escena_abuelo_3", "Abuelo: Tengo esto para ti, pero no lo abras todavía.<br/>" )
		primitives.GD_CreateMsg ("es","escena_abuelo_4", "Te entrega un sobre y te coge el móvil.")
		primitives.GD_CreateMsg ("es","escena_abuelo_5", "Abuelo: Está claro que este momento hay que retratarlo!<br/>")
		primitives.GD_CreateMsg ("es","escena_abuelo_6", "Se saca un selfie contigo y entra en la casa, dejándote a solas en el mismo porche de hojas muertas al que saltaste hace ahora un rato.<br/>")
		primitives.GD_CreateMsg ("es","escena_abuelo_7", "Un sobre y una foto. Truco y trato, lo tienes todo esta noche. Te sientas en el bordillo del porche y los observas con detenimiento:<br/>")

		primitives.GD_CreateMsg ("es","sobre", "No puede ser! Dentro está la carta que te salió mientras jugabas con tus amigos, ¿pero qué diablos...?, ¿cómo es que...?<br/>")
		primitives.GD_CreateMsg ("es","foto", "Tus desvelos no podían quedar en saco roto: en la foto que sacó el Abuelo sales tú sonriendo, con un murciélago apoyado en tu hombro.<br/>")

		primitives.GD_CreateMsg ("es","caray", "Caray, qué noche. Sales de la finca de Los Raritos, caminando entre zombies y brujas.")

		primitives.CA_ShowMsg ("escena_final_1" )
		primitives.CA_PressKey ("tecla");
		primitives.CA_ShowMsg ("escena_final_2" )
		primitives.CA_ShowMsg ("escena_final_3" )
		primitives.CA_ShowMsg ("escena_final_4" )
		primitives.CA_PressKey ("tecla");
		primitives.CA_ShowMsg ("escena_final_5" )
		primitives.CA_ShowMsg ("escena_final_6" )

		primitives.CA_PressKey ("tecla");

		primitives.CA_ShowMsg ("escena_final_7" )

		primitives.CA_PressKey ("tecla");

		primitives.CA_ShowMsg ("escena_abuelo_1" )
		primitives.CA_ShowMsg ("escena_abuelo_2" )
		primitives.CA_PressKey ("tecla");
		primitives.CA_ShowMsg ("escena_abuelo_3" )
		primitives.CA_ShowMsg ("escena_abuelo_4" )
		primitives.CA_PressKey ("tecla");
		primitives.CA_ShowMsg ("escena_abuelo_5" )
		primitives.CA_ShowMsg ("escena_abuelo_6" )
		primitives.CA_ShowMsg ("escena_abuelo_7" )

	  // to-do: interactivo
		primitives.GD_CreateMsg ("es","tecla-sobre", "Ver el contenido del sobre")
		primitives.CA_PressKey ("tecla-sobre");
		primitives.CA_ShowMsg ("sobre" )
		primitives.GD_CreateMsg ("es","tecla-foto", "Ver el selfie con el Abuelo Rarito")
		primitives.CA_PressKey ("tecla-foto");
		primitives.CA_ShowMsg ("foto" )

		primitives.GD_CreateMsg ("es","tecla-caray", "Sales a la calle")
		primitives.CA_PressKey ("tecla-caray");

	  primitives.CA_EndGame("caray")
		usr.setValue({id:"intro2", value:"1"})

	}

}