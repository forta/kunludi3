const prompt = require("prompt-async");

const kunludi_exporter = require ('./modulos/KunludiExporter.js');

 
async function example_async() // Available only with `prompt-async`!
{
    // Start the prompt.
    prompt.start();
 
    // Get two properties from the user: the `username` and `email`.
    const {username, email} = await prompt.get(["username", "email"]);
    // Get two properties from the user: the `password` and `food`.
    const {password, food} = await prompt.get(["password", "food"]);
 
	let data = {
		username: username,
		email: email,
		password: password,
		food: food
	}
	
    // Log the results.
    console.log("Command-line input received: " + JSON.stringify (data));

	// send to the server
	kunludi_exporter.exportData(data)
	
}
 
async function error_handling_async()
{
    try
    {
        await example_async();
    }
    catch(error)
    {
        console.error("An error occurred: ", error);
    }
}
 
error_handling_async();

