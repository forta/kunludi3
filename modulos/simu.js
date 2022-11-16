
const kunludi_proxy = require ('./RunnerProxie.js');

kunludi_proxy.loadGames()

glist = kunludi_proxy.getGames()

let state = {locale:"es", kernelMessages: []}

kunludi_proxy.setLocale(state)

// ---------------
//error porqueno tiene gameSlotList

kunludi_proxy.refreshGameSlotList ("miqueridahermana")

kunludi_proxy.join ("miqueridahermana", "default")

let reactionList = kunludi_proxy.getReactionList()

let choices = kunludi_proxy.getChoices()

for (let c=0; c<choices.length;c++) {
  if (choices[c].isLeafe) {
    console.log (c + "# " + choices[c].action.actionId + ": " + JSON.stringify(choices[c].action))
  }
}

process.exit()
