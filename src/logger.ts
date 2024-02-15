const { Client } = require("@elastic/elasticsearch");
const APM = require('elastic-apm-node')
const constants = require("./constants");
const log = async (message: string, level: string) => {
  // Instantiate the client with an API key
/*   const client = new Client({
    node: constants.ELASTIC_ENDPOINT,
    auth: { apiKey: constants.ELASTIC_API_KEY },
  }); */
  console.log(`${Date.now()} [${level}]:  ${message}`);
/*   await client.index({
    index: 'logging',
    id: 'log-entry' + Date.now(),
    document: {
      log: message,
      time: Date.now(),
      level: level
    },
  }) */
};

module.exports = log;
