// Programa para ir "a tiro hecho" a un juego en concreto
// También sirve de referencia para integrar este código en kunludi3.js o en cualquier cliente que se quiera crear.

const prompt = require('prompt-sync')({sigint: true});

const gameList = ["intruso", "miqueridahermana", "tresfuentes", "texel", "tresfuentes", "vampiro", "venganza", "wild-party"]
const gameId = "miqueridahermana"
const slotId = "default"
const locale = "es"

const kunludi_proxy = require ('./RunnerProxie.js');

kunludi_proxy.loadGames()

let state = {locale:locale, kernelMessages: []}

state.games = kunludi_proxy.getGames()

kunludi_proxy.setLocale(state)

kunludi_proxy.refreshGameSlotList (gameId)

kunludi_proxy.join (gameId, slotId)

// setLocale otra vez para tener los mensajes traducidos
kunludi_proxy.setLocale(state)

const kunludi_render = require ('./KunludiRender.js');

for (;;) {

  // show description
  console.log ("\nReaction List:\n")
  kunludi_render.showReactionList(kunludi_proxy.getReactionList())

  // show available user actions
  console.log ("Choices:\n")
  let choices = kunludi_proxy.getChoices()
  kunludi_render.showChoiceList(choices)

  // get user action
  let com
  let typedCommand = prompt('# ');
  com = typedCommand.split(" ")
  if (com.length == 0) continue
  if (com.length == 0) {
    console.log ("Wrong command")
    continue
  }

  if (com[0] == "q") {
    console.log ("Bye" )
    process.exit()
  }


  let comValue = com[0]

  // echo
  console.log ("Echo #" + comValue + ": " + kunludi_render.getChoice(choices[comValue]) )

  // run user action (demo)
  kunludi_proxy.processChoice (choices[comValue])

}
