
const kunludi_proxy = require ('./RunnerProxie.js');

kunludi_proxy.loadGames()

let state = {locale:"es", kernelMessages: []}

state.games = kunludi_proxy.getGames()

kunludi_proxy.setLocale(state)

// ---------------
//error porqueno tiene gameSlotList

kunludi_proxy.refreshGameSlotList ("miqueridahermana")

kunludi_proxy.join ("miqueridahermana", "default")

// otra vez para tener los mensajes traducidos
kunludi_proxy.setLocale(state)

let reactionList = kunludi_proxy.getReactionList()

console.log ("\nReaction List:\n")
for (let r=0; r<reactionList.length;r++) {
  console.log ("# " + r + ": " + reactionList[r].i8n.es.txt)
  //console.log ("# " + r + ": " + JSON.stringify(reactionList[r]))
}

console.log ("Choices:\n")

let choices = kunludi_proxy.getChoices()

for (let c=0; c<choices.length;c++) {
  if (choices[c].isLeafe) {
    console.log ("\t>" + c + ": " + choices[c].i8n.es.txt)
    //console.log ("\t>" + c + ": " + choices[c].action.actionId + ": " + JSON.stringify(choices[c].i8n))
  }
}

// to-do: loop para meter número de acción y enviarla


process.exit()
