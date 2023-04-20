const kunludi3 = require ('./kunludi3-bundle.js');
//const kunludi3 = require ('./kunludi3.js');

const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const getInput = async () => {
  let text = '';

  while (text.trim().toLowerCase() !== 'quit') {

		if (kunludi3.getModName() == "kl3-game") {
			text = await new Promise((resolve) => {
	      rl.question('> ', resolve);
	    });
		} else {
			text = await new Promise((resolve) => {
	      rl.question('Enter text (or type "quit" to exit): ', resolve);
	    });
		}

		// Handle the input
    console.log(`You entered: ${text}`);

		if (kunludi3.getModName() == "kl3-game") {
			if (text == 'quit') {
				kunludi3.interaction ("..")
			} else {
				// send command to kl3-game
				let gameCommand = "game-action " + text
				kunludi3.processModuleCommand (gameCommand.split(" "))
			}
		} else {
			if (text == 'quit') {
				return
			}
		}

		if (text == 'q') { text = ".."}

		if (text != 'quit') {
			//kunludi3.interaction (text)
      kunludi3.interaction (text)
		}

  }

  // Close readline interface when user enters "quit"
  rl.close();

};

kunludi3.init()
getInput()
