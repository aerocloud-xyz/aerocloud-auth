const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const constants = require("../constants");
const sendNotification = require("../notification");

router.get("/", (req, res) => {
    sendNotification("API Status checked-OK");
    res.status(200).json({ status: "API OK" });
});
module.exports = router;