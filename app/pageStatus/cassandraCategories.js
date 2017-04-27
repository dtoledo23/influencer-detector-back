const getClient = require("../../db/connection");
const Long = require('cassandra-driver').types.Long;
const _ = require('lodash');

const getCategories = (ids) => {
    let client = getClient();
    let promises = [];
    let categories = [];
    ids.forEach((id) => {
        promises.push(
            client.execute("SELECT categories FROM nodes WHERE id = ?;", [Long.fromString(id)])
            .then(result => {
                categories = _.union(categories, result.rows[0].categories);
            })
        )
    });

    return Promise.all(promises)
        .then(() => categories)
}

module.exports = getCategories;