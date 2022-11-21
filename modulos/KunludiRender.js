let clientTpye = "txt"

module.exports = exports = { // commonjs
//export default {
  getClientTpye:getClientTpye,
  showReactionList:showReactionList,
  showChoiceList:showChoiceList,
  getChoice:getChoice

}

function getClientTpye() {
  return clientTpye
}

function showReactionList(reactionList) {
  for (let r=0; r<reactionList.length;r++) {
    if (reactionList[r].i8n.es.txt != "") {
        console.log (reactionList[r].i8n.es.txt)
    } else {
      console.log ("# " + r + ": " + JSON.stringify(reactionList[r]))
    }
  }
}

function showChoiceList(choiceList) {
  // acciones directas
  console.log ("Acciones Directas")
  for (let c=0; c<choiceList.length;c++) {
    if (choiceList[c].isLeafe) {
      console.log ("\t>" + c + ": " + getChoice(choiceList[c]))
    }
  }
  // acciones no directas
  console.log ("Acciones No-Directas")
  for (let c=0; c<choiceList.length;c++) {
    if (! choiceList[c].isLeafe) {
      console.log ("\t>" + c + ": " + getChoice(choiceList[c]))
    }
  }

}

function getChoice(choice) {
  if (choice.i8n.es.txt != "") {
    return choice.i8n.es.txt
  }

  return choice.action.actionId + ": " + JSON.stringify(choice.i8n)
}
