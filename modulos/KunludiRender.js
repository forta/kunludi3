let clientTpye = "txt"

module.exports = exports = { // commonjs
//export default {
  getClientTpye:getClientTpye,
  showReactionList:showReactionList,
  showMenu:showMenu,
  showChoiceList:showChoiceList,
  getChoice:getChoice,
  showMsg:showMsg,
  showReaction:showReaction,
  replaceCR:replaceCR

}

function getClientTpye() {
  return clientTpye
}

function showReactionList(reactionList) {
  for (let r=0; r<reactionList.length;r++) {
    showReaction (reactionList[r])
  }
}

function showMsg(msg) {

  if (msg.i8n.es.txt != "") {
    console.log (replaceCR(msg.i8n.es.txt))
  } else {
    console.log ("msg: " + JSON.stringify(msg))
  }
}

function showReaction(reaction) {
  if (reaction.i8n.es.txt != "") {
      console.log ("+ " + replaceCR(reaction.i8n.es.txt))
  } else {
    console.log ("reaction: " + JSON.stringify(reaction))
  }
}

function showMenu(menu) {
  let outStr = "Menu:| "
  for (let m=0; m<menu.length;m++) {
      outStr += m + ": " + menu[m].i8n.es.txt +  " | "
  }
  console.log (outStr)

}

function showChoiceList(turnState) {
  let choiceList = turnState.choices
  // Grupos: choiceId": top, directActions, directionGroup, itemGroup (itemGroup: here, carrying)

  // acciones directas: "choiceId":"action0
  let outStr = "Acciones Directas:| "
  for (let c=0; c<choiceList.length;c++) {
    if (choiceList[c].choiceId == "action0") {
      outStr += c + ": " + getChoice(choiceList[c]) + " | "
    }
  }
  console.log (outStr)

  // direcciones directas:  "choiceId":"dir1"
  outStr = "Direcciones:| "
  for (let c=0; c<choiceList.length;c++) {
    if (choiceList[c].choiceId == "dir1") {
      outStr += c + ": " + getChoice(choiceList[c])  + " | "
    }
  }
  console.log (outStr)

  // items
  outStr = "Items:| "
  for (let c=0; c<choiceList.length;c++) {
    if (choiceList[c].choiceId == "obj1") {
      outStr += c + ": " + getChoice(choiceList[c]) + " | "
    }
  }
  console.log (outStr)

  // on selected item
  if (turnState.selectedItem != "") {
  //if (turnState.choicesOnItem.item1 != -1) {
    outStr = "Selected Item: " + turnState.selectedItem + "|"

    // first version

    for (let c=0; c<choiceList.length;c++) {
      if ((choiceList[c].choiceId == "action") || (choiceList[c].choiceId == "action2")) {
          outStr += c + ": " + getChoice(choiceList[c])  + " | "
      }
    }


    // second version
    /*
    for (let c=0; c<turnState.choicesOnItem.choices.length;c++) {
      if ((turnState.choicesOnItem.choices[c].choiceId == "action") || (turnState.choicesOnItem.choices[c].choiceId == "action2")) {
         outStr += "A" + c + ": " + getChoice(turnState.choicesOnItem.choices[c])  + " | "
      }
    }
    */

    console.log (outStr)
  }

}

function getChoice(choice) {
  if (choice.i8n.es.txt != "") {
    return replaceCR(choice.i8n.es.txt)
  }

  return choice.action.actionId + ": " + JSON.stringify(choice.i8n)
}

function replaceCR(msgIn) {
  let regex = /<br\s*[\/]?>/gi;
  return msgIn.replace(regex, "\n");

  // ES12+: return msgIn.replace("<br/>", "\n")

}
