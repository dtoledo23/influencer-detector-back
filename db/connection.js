const settings = require('./settings.js');
const cassandra = require('cassandra-driver');

let client;

function connect() {
    client = new cassandra.Client({
        contactPoints: process.env.CASSANDRA_IP_ADDRESSES.split(","),
        keyspace: process.env.CASSANDRA_KEYSPACE,
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