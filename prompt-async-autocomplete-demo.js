// ref: https://www.npmjs.com/package/async-autocomplete-cli


const prompt = require("prompt-async");

const kunludi_exporter = require ('./modulos/KunludiExporter.js');

/*

    // Log the results.
    console.log("Command-line input received: " + JSON.stringify (data));

	// send to the server
	kunludi_exporter.exportData(data)

*/


const { asyncAutocomplete } = require('async-autocomplete-cli')

async function go() {
  const instance = await asyncAutocomplete({
    message: 'Select an AWS EC2 Instance',
    suggest: async (input, cancelationToken, yield) => {
      const results = []
      if (!input) {
        // getRecentSelectedInstances not implemented in this example.
        results.push(...(await getRecentSelectedInstances()))
        yield(results)
      }

      const Filters = []
      if (input)
        Filters.push({
          Name: 'tag:Name',
          Values: ['*${input}*'],
        })
      const args = { MaxResults: 100 }
      if (Filters.length) args.Filters = Filters
      const request = ec2.describeInstances(args)
      cancelationToken.on('canceled', () => request.abort())

      if (cancelationToken.canceled) return []

      const { Reservations } = await request.promise()
      for (const { Instances } of Reservations || []) {
        for (const Instance of Instances || []) {
          const { InstanceId, Tags = [] } = Instance
          const name = (Tags.find(t => t.Key === 'Name') || {}).Value
          results.push({
            title: "${InstanceId} ${name || ''}",
            value: Instance,
            initial: !results.length,
          })
        }
      }

      if (!results.length) {
        results.push({
          title: "No matching EC2 Instances found ${input ? ' with name starting with ${input}' : '' }",
        })
      }

      return results
    },
  })
}

go()


