
const kunludi_proxy = require ('./RunnerProxie.js');

kunludi_proxy.loadGames()

glist = kunludi_proxy.getGames()

let state = {locale:"es", kernelMessages: []}

kunludi_proxy.setLocale(state)

// ---------------
//error porqueno tiene gameSlotList

kunludi_proxy.refreshGameSlotList ("miqueridahermana")

kunludi_proxy.join ("miqueridahermana")
