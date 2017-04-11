const router = require("express").Router();

// Define API routes.
router.route("/")
    .get((req, res) => {
        res.send("Influencer Detector API");
    });

module.exports = router;