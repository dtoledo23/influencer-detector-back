const router = require("express").Router();
const checkIfExists = require('../pageStatus/cassandraStatus');
const Long = require('cassandra-driver').types.Long;
const getFacebookId = require('../pageStatus/fbStatus');
const rp = require('request-promise');

// Define API routes.
router.route("/status")
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

router.route("/page")
    .post((req, res) => {
        const options = {
            method: 'POST',
            uri: process.env.CRAWLER_HOST + "/page",
            json: true // Automatically stringifies the body to JSON 
        };
        let promises = [];
        console.log(req.body);
        req.body.forEach((pageInfo) => {
            options.body = pageInfo;
            promises.push(rp(options).catch(console.error));
        });
        Promise.all(promises)
            .then((result) => {
                res.status(200).send("OK");
            })
            .catch(res.status(500).send);
    });


module.exports = router;