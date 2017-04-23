const router = require("express").Router();
const checkIfExists = require('../pageStatus/cassandraStatus');
const Long = require('cassandra-driver').types.Long;
const getFacebookId = require('../pageStatus/fbStatus');
const go = require('node-go-require');
const getCrawlerGo = require('../../../../../go/src/github.com/dtoledo23/influencer-detector-crawler/vendor/crawler/facebook/callAPIHelpers.go');

// Define API routes.
router.route("/page/status")
    .get(async(req, res) => {
        let status = {};

        const url = req.query.url;
        if (!url) {
            res.send("La cagaste pendejo");
        }

        let id = await getFacebookId(url)
        console.log("id", id)
        if (!id) {
            res.json({ "id": null, "status": "non-existant" });
            return;
        }

        const idLong = Long.fromString(id);
        let fetched = await checkIfExists(idLong)
        if (fetched) {
            status = { "id": id, "status": "ready" };
        } else {
            status = { "id": id, "status": "fetchable" };
        }

        res.json(status);
    });



module.exports = router;