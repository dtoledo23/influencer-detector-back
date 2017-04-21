const router = require("express").Router();
const checkIfExists = require('../pageStatus/cassandraStatus');
const Long = require('cassandra-driver').types.Long;
const getFacebookId = require('../pageStatus/fbStatus');

// Define API routes.
router.route("/page/status")
    .get(async(req, res) => {
        let status = "";

        const url = req.query.url;
        if (!url) {
            res.send("La cagaste pendejo");
        }

        let id = await getFacebookId(url)
        console.log("id", id)
        if (!id) {
            res.send("non-existant");
            return;
        }

        const idLong = Long.fromString(id);
        let fetched = await checkIfExists(idLong)
        if (fetched) {
            status = "ready";
        } else {
            status = "fetchable";
        }

        res.send(status);
    });

module.exports = router;