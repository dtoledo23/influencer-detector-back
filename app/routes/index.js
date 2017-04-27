const router = require("express").Router();
const Long = require('cassandra-driver').types.Long;
const rp = require('request-promise');

const checkIfExists = require('../pageStatus/cassandraStatus');
const getCategories = require('../pageStatus/cassandraCategories');
const getFacebookId = require('../pageStatus/fbStatus');
const startAnalysis = require('../spark/job');


// Define API routes.
router.route("/status")
    .get(async(req, res) => {
        let status = {};

        const url = req.query.url;
        if (!url) {
            res.send("Provide an url");
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

router.route("/analyze")
    .post((req, res) => {
        const options = {
            method: 'POST',
            uri: process.env.CRAWLER_HOST + "/page",
            json: true // Automatically stringifies the body to JSON 
        };
        let promises = [];
        console.log(req.body);
        const { category, pages } = req.body;
        pages.forEach((pageInfo) => {
            options.body = pageInfo;
            promises.push(rp(options).catch(console.error));
        });
        Promise.all(promises)
            .then(() => {
                return startAnalysis(category, pages);;
            })
            .then(result => {
                res.status(200).json(result)
            })
            .catch(res.status(500).send);
    });

router.route("/categories")
    .post((req, res) => {
        getCategories(req.body.pages)
            .then((result) => {
                res.status(200).json(result);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            })

    });

module.exports = router;