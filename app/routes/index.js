const router = require("express").Router();
const checkIfExists = require('../pageStatus/cassandraStatus');
const getCategories = require('../pageStatus/cassandraCategories');
const Long = require('cassandra-driver').types.Long;
const getFacebookId = require('../pageStatus/fbStatus');
const rp = require('request-promise');

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
            .then((result) => {

                res.status(200).json({
                    "category": category,
                    "number_nodes": 34,
                    "number_edges": 54,
                    "number_likes": 34,
                    "top_five": [{
                            "id": 332466510150563,
                            "name": "Fernanda Vainilla",
                            "profile_picture": "https://scontent.xx.fbcdn.net/v/t1.0-1/c0.9.50.50/p50x50/1544535_810766095653933_3419321256284101039_n.png?oh=b5daa8ab089b6904bd9ed2eff0e1b4aa&oe=597CE3B3",
                            "ranking": 3,
                            "score": 97,
                            "likes": 23,
                            "talking_about": 12
                        },
                        {
                            "id": 29092950651,
                            "name": "Matute Salmón",
                            "profile_picture": "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/10941522_10155734866490652_2013649388007612938_n.jpg?oh=c973296799d91663068c90c2cf5a7859&oe=598D1F24",
                            "ranking": 4,
                            "score": 91,
                            "likes": 32,
                            "talking_about": 4
                        },
                        {
                            "id": 449113661917721,
                            "name": "Sergio Asado",
                            "profile_picture": "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/11150341_456591447836609_5132202490598543723_n.jpg?oh=88fe791eaa34098862b79e45a79609b2&oe=59817747",
                            "ranking": 5,
                            "score": 79,
                            "likes": 93,
                            "talking_about": 20
                        },
                        {
                            "id": 641285679248839,
                            "name": "Pedro Limon",
                            "profile_picture": "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/12509388_1131296853581050_2770478329214469546_n.png?oh=fe49ce0b0558e9d09ed3a2ac0ff35a3a&oe=597D5B30",
                            "ranking": 1,
                            "score": 96,
                            "likes": 132,
                            "talking_about": 65
                        },
                        {
                            "id": 46246991781,
                            "name": "Sarah Panela",
                            "profile_picture": "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/76212_10151023496156782_1227836263_n.jpg?oh=42c9f95be1fd747c255be393880e45f4&oe=59872C84",
                            "ranking": 2,
                            "score": 86,
                            "likes": 119,
                            "talking_about": 37
                        }
                    ]
                });
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