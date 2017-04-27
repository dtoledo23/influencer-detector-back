const getClient = require("../../db/connection");

const checkIfExists = (id) => {
    let client = getClient();
    console.log(id)
    console.log(typeof id);
    return client.execute("SELECT id, name FROM nodes WHERE id = ?;", [id])
        .then(result => {
            return result.rowLength != 0;
        })
        .catch((err) => {
            console.log(err)
            return false;
        });
}

module.exports = checkIfExists;