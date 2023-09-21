const { Client } = require('@elastic/elasticsearch');
const log = () => {

// Import the client
const { Client } = require('@elastic/elasticsearch');
// Instantiate the client with an API key
const client = new Client({
  auth: { apiKey: 'YOUR_API_KEY' }
})
          
};

module.exports = log;