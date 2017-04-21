const settings = require('./settings.js');
const cassandra = require('cassandra-driver');

let client;

function connect() {
    client = new cassandra.Client({
        contactPoints: ['127.0.0.1'],
        keyspace: 'influencer_detector'
    });

    client.connect(function(err) {
        if (err) {
            throw err;
        }
    });
}

module.exports = () => {
    if (!client) {
        connect();
    }
    return client;
}