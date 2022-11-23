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
  // Grupos: choiceId": top, directActions, directionGroup, itemGroup (itemGroup: here, carrying)

  // acciones directas: "choiceId":"action0
  console.log ("Acciones Directas")
  for (let c=0; c<choiceList.length;c++) {
    if (choiceList[c].choiceId == "action0") {
      console.log ("\t>" + c + ": " + getChoice(choiceList[c]))
    }
  }

  // direcciones directas:  "choiceId":"dir1"
  console.log ("Direcciones")
  for (let c=0; c<choiceList.length;c++) {
    if (choiceList[c].choiceId == "dir1") {
      console.log ("\t>" + c + ": " + getChoice(choiceList[c]))
    }
  }


  // items
  console.log ("Items")
  for (let c=0; c<choiceList.length;c++) {
    if (choiceList[c].choiceId == "obj1") {
      console.log ("\t>" + c + ": " + getChoice(choiceList[c]))
    }
  }

  // on selected item
  console.log ("On selected item")
  for (let c=0; c<choiceList.length;c++) {
    if ((choiceList[c].choiceId == "action") || (choiceList[c].choiceId == "action2")) {
      console.log ("\t>" + c + ": " + getChoice(choiceList[c]))
    }
  }

  //resto
  /*
  for (let c=0; c<choiceList.length;c++) {
      console.log ("\t>" + c + ": " + JSON.stringify(choiceList[c]))
  }
  */


}

function getChoice(choice) {
  if (choice.i8n.es.txt != "") {
    return choice.i8n.es.txt
  }

  return choice.action.actionId + ": " + JSON.stringify(choice.i8n)
}
